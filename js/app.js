const renderTodoList = (todos) => {
    return todos.map((todo) => {
        let className = '';
        let editFocused = '';

        if (todo.completed) {
            className = 'completed';
        } else if (todo.editing) {
            className = 'editing';
            editFocused = 'focused';
        }

        let checked = todo.completed ? 'checked' : '';
        console.log(editFocused);

        return `<li class="${className}">
            <div class="view">
                <input class="toggle" type="checkbox" ${checked} onclick='app.run("toggleCompleted", ${todo.id})'>
                <label ondblclick='app.run("initiateEdit", ${todo.id})'>${todo.title}</label>
                <button class="destroy"></button>
            </div>
            <input id="todo-edit-input-${todo.id}" class="edit" value="${todo.title}" onblur='app.run("stopEditing", ${todo.id})' onkeyup='app.run("editTodo", ${todo.id}, event)'>
        </li>`;
    }).join("\n");
}

const isAllTodosCompleted = (todos) => {
    return todos.every((todo) => todo.completed)
}
const renderToggle = (state) => {
    const checked = isAllTodosCompleted(state.todos) ? 'checked' : '';
    return `<input id="toggle-all" class="toggle-all" type="checkbox" ${checked} onclick='app.run("toggleAllChecked")'>`;
}

let idSeq = 1;
function nextId() {
    return idSeq++;
}

const render = (state) => `
    <section class="main">` + renderToggle(state) + `
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list">` + renderTodoList(state.todos) + `

        </ul>
    </section>
    <footer class="footer">
        <!-- This should be '0 items left' by default -->
        <span class="todo-count"><strong>0</strong> item left</span>
        <!-- Remove this if you don't implement routing -->
        <ul class="filters">
            <li>
                <a class="selected" href="#/">All</a>
            </li>
            <li>
                <a href="#/active">Active</a>
            </li>
            <li>
                <a href="#/completed">Completed</a>
            </li>
        </ul>
        <!-- Hidden if no completed items are left ↓ -->
        <button class="clear-completed" onclick='app.run("clearCompleted")'>Clear completed</button>
    </footer>
`

const view = state => {
    let html = `<header class="header">
        <h1>todos</h1>
        <input value='${state.unsavedTodo}' class="new-todo" placeholder="What needs to be done?" autofocus onkeyup='app.run("newTodo", event)' />
    </header>`

    if (state.todos.length) {
        html += render(state);
    }

    return html;
}

function markAllTodosIncomplete(state) {
    state.todos.forEach(todo => {
        todo.completed = false;
    });
    return state;
}
function markAllTodosComplete(state) {
    state.todos.forEach(todo => {
        todo.completed = true;
    });
    return state;
}
function updateTodoByID(state, id, fun) {
    state.todos.forEach(todo => {
        if (todo.id.toString() === id.toString()) {
            fun(todo);
        }
    })
}
const update = {
    newTodo: (state, event) => {
        const newState = Object.assign({}, state);
        const title = event.target.value.trim();

        if (event.keyCode === 13 && title.length) {
            newState.unsavedTodo = "";
            newState.todos = state.todos.concat({
                title: title,
                completed: false,
                editing: false,
                id: nextId()
            });
        } else {
            newState.unsavedTodo = event.target.value;
        }
        return newState;
    },
    toggleAllChecked: (state) => {
        if (isAllTodosCompleted(state.todos)) {
            return markAllTodosIncomplete(state);
        } else {
            console.log("balls")
            return markAllTodosComplete(state);
        }
    },
    clearCompleted: (state) => {
        const newTodos = state.todos.filter(todo => !todo.completed);
        state.todos = newTodos;
        return state;
    },
    toggleCompleted: (state, id) => {
        updateTodoByID(state, id, todo => todo.completed = !todo.completed);
        return state;
    },
    initiateEdit: (state, id) => {
        updateTodoByID(state, id, todo => todo.editing = true);
        return state;
    },
    stopEditing: (state, id) => {
        updateTodoByID(state, id, todo => todo.editing = false);
        return state;
    },
    editTodo: (state, id, event) => {
        const title = event.target.value.trim();
        updateTodoByID(state, id, todo => todo.title = title);

        if (event.keyCode === 13 && title.length) {
            updateTodoByID(state, id, todo => todo.editing = false);
        }

        return state;
    }
};

const state = {
    unsavedTodo: "",
    todos: []
};

app.start('app', state, view, update);
app.on("initiateEdit", (id) => {
    document.getElementById(`todo-edit-input-${id}`).focus();
});
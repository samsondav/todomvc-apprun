const renderTodoList = (todos) => {
    return todos.map((todo) => {
        let className = '';

        if (todo.completed) {
            className = 'completed';
        } else if (todo.editing) {
            className = 'editing';
        }

        let checked = todo.completed ? 'checked' : '';

        return `<li class="${className}">
            <div class="view">
                <input class="toggle" type="checkbox" ${checked}>
                <label>${todo.title}</label>
                <button class="destroy"></button>
            </div>
            <input class="edit" value="Create a TodoMVC template">
        </li>`;
    }).join("\n");
    //     `
    // <!-- These are here just to show the structure of the list items -->
    // <!-- List items should get the class 'editing' when editing and 'completed' when marked as completed -->
    // <li class="completed">
    //     <div class="view">
    //         <input class="toggle" type="checkbox" checked>
    //         <label>Taste JavaScript</label>
    //         <button class="destroy"></button>
    //     </div>
    //     <input class="edit" value="Create a TodoMVC template">
    // </li>
    // <li>
    //     <div class="view">
    //         <input class="toggle" type="checkbox">
    //         <label>Buy a unicorn</label>
    //         <button class="destroy"></button>
    //     </div>
    //     <input class="edit" value="Rule the web">
    // </li>`
}
const render = (state) => `
    <section class="main">
        <input id="toggle-all" class="toggle-all" type="checkbox">
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
        <button class="clear-completed">Clear completed</button>
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

const update = {
    'newTodo': (state, event) => {
        const newState = Object.assign({}, state);
        const title = event.target.value.trim();

        if (event.keyCode === 13 && title.length) {
            newState.unsavedTodo = "";
            newState.todos = state.todos.concat({
                title: title,
                completed: false,
                editing: false
            });
        } else {
            newState.unsavedTodo = event.target.value;
        }
        console.log("state", state)
        return newState;
    }
};

const state = {
    unsavedTodo: "",
    todos: []
};

app.start('app', state, view, update);
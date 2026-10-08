const state = {
    todos: [],
    important: [],
    search: "",
};


const todosEl = document.querySelector("#todos");
const favoritesEl = document.querySelector("#favorites");
const searchEl = document.querySelector("#searchInput");
const formEl = document.querySelector("#searchForm")
const messageEl = document.querySelector("#message");

function render() {
    const term = state.search.toLowerCase();
    const shown = state.todos.filter((todo) =>
        todo.todo.toLowerCase().includes(term),
    );

    todosEl.innerHTML = shown.map((todo) => createCard(todo)).join("");
    favoritesEl.innerHTML = state.important.map((todo) => createCard(todo)).join("");

    if (shown.length === 0) {
        todosEl.innerHTML = `
            <p class="empty">
                No tasks match your search.
            </p>
        `;

    }

    if (state.important.length === 0) {

        favoritesEl.innerHTML = `
            <p class="empty">
                No important tasks yet.
            </p>
        `;

    }

}

function createCard(todo) {
    const saved = state.important.some( (important) => important.id === todo.id );

    return `
        <article class="card
            ${todo.completed ? "completed" : "pending"}"
      >
            <div class="card-content">

            <h3>${todo.todo}</h3>

                <p class="status">
                    ${
                        todo.completed
                            ? "Completed"
                            : "Pending"
                    }
                </p>
                <p>
                    User ID: ${todo.userId}
                </p>

                <button
                    onclick="addOrRemove(${todo.id})"
                >
                    ${saved ? "	&#10084" : "&#9825"}
                </button>
            </div>

        </article>
    `;
}

async function loadTodos(query) {
    messageEl.textContent = "Loading...";
    try {
        const response = await fetch(
            "https://dummyjson.com/todos"
        );

        if (!response.ok) {
            throw new Error("Failed to load todos");
        }

        const data = await response.json();
        state.todos = data.todos;

        messageEl.textContent = "";

        render();

    } catch (error) {
        messageEl.textContent = "Could not load tasks.";
        console.log(error);
    }
}

function addOrRemove(id) {
     const exists = state.important.find((todo) => todo.id === id
    );

    if (exists) {
        state.important = state.important.filter((todo) => todo.id !== id );
    } else {
        const todo = state.todos.find(
            (todo) => todo.id === id
        );

        if (todo) {state.important.push(todo); }

    }

    saveImportant();

    render();
}


function saveImportant() {
    localStorage.setItem( "important", JSON.stringify(state.important)
    );
}

function loadImportant() { 
    state.important = JSON.parse( localStorage.getItem("important")) || [];

}


formEl.addEventListener("submit", function (event) {
        event.preventDefault();

    const query = searchEl.value.trim();

     state.search = query;
     
     render();

    }
);

function init() {
    loadImportant();
    loadTodos("");
}
init();

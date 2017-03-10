const choo = require('choo')
const html = require('choo/html')
const extend = require('./extend')
const store = require('./localStorage')

const app = choo()

app.model({
  state: {
    todos: []
  },
  reducers: {
    receiveNewTodo: (state, data) => {
      return {todos: [...state.todos, data]}
    },
    replaceTodo: (state, {index, todo}) => {
      const todos = state.todos.slice()
      todos[index] = todo
      return {todos}
    },
    deleted: (state, index) => {
      const todos = state.todos.slice()
      todos.splice(index, 1)
      return {todos}
    },
    receiveTodos: (state, data) => ({todos: data})
  },
  effects: {
    getTodos: (state, data, send, done) => {
      store.getAll('todos', (todos) => {
        send('receiveTodos', todos, done)
      })
    },
    addTodo: (state, data, send, done) => {
      store.add('todos', data, () => {
        send('receiveNewTodo', data, done)
      })
    },
    toggle: (state, index, send, done) => {
      const todos = state.todos.slice()
      const oldTodo = todos[index]
      const todo = extend(oldTodo, {done: !oldTodo.done})
      store.replace('todos', index, todo, () => {
        send('replaceTodo', {index, todo}, done)
      })
    },
    deleteTodo: (state, index, send, done) => {
      const todos = state.todos.slice()
      store.delete('todos', index, () => {
        send('deleted', index, done)
      })
    }
  }
})

const view = (state, prev, send) => {
  return html`
    <div onload=${() => send('getTodos')}>
      <h1>Todo (${countNotDone(state.todos)})</h1>
      <form onsubmit=${onSubmit}>
        <input type="text" placeholder="New Item" id="title">
      </form>
      <ul>
        ${state.todos.map(renderTodo)}
      </ul>
    </div>`

  function renderTodo(todo, index) {
    const todoEntry = html`
      <label>
        <input type="checkbox" onchange=${onChange} ${todo.done ? 'checked' : ''}/>
        ${todo.title}
      </label>`

    const todoEntryDecorated = todo.done ? html`<strike>${todoEntry}</strike>` : todoEntry

    return html`
    <li>
      ${todoEntryDecorated}
      <button onclick=${deleteTodo}>Delete</button>
    </li>`

    function onChange() {
      send('toggle', index)
    }

    function deleteTodo(e) {
      send('deleteTodo', index)
    }
  }

  function onSubmit(e) {
    const input = e.target.children[0]
    send('addTodo', {title: input.value})
    input.value = ''
    e.preventDefault()
  }
}

app.router([
  ['/', view]
])

const tree = app.start()
document.body.appendChild(tree)

function countNotDone(todos) {
  return todos.reduce((acc, val) => {
    return val.done ? acc : acc+1
  }, 0)
}

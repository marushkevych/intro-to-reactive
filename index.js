const choo = require('choo')
const html = require('choo/html')

const app = choo()

const view = (state, prev, send) => {
  return html`<h1>Hello World!</h1>`
}

app.router([
  ['/', view]
])

const tree = app.start()
document.body.appendChild(tree)

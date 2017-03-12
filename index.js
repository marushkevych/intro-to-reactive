const choo = require('choo')
const html = require('choo/html')

const app = choo()

const view = (state, prev, send) => {
  return html`
  <div class='tile'>
    <h1>Hello World!</h1>
  </div>
  `
}

app.router([
  ['/', view]
])

const tree = app.start()
document.body.appendChild(tree)

import Rx from 'rxjs/Rx'

var button = document.querySelector('.button')
var label = document.querySelector('h4')

var click$= Rx.Observable.fromEvent(button, 'click')

var doubleClick$ = click$
  .bufferWhen(() => click$.debounceTime(250))
  .map(arr => arr.length)
  .filter(len => len === 2);


doubleClick$.subscribe(event => {
  label.textContent = 'double click'
})

doubleClick$
  .delay(1000)
  .subscribe(suggestion => {
    label.textContent = '-'
  })
  
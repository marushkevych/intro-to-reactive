import Rx from 'rxjs/Rx'
const button = document.querySelector('.button') 
const request$ = Rx.Observable.fromEvent(button, 'click')
  .map(e => 'https://api.github.com/users')

const response$ = request$
  .flatMap(url => Rx.Observable.fromPromise(jQuery.getJSON(url)))

response$.subscribe(json => console.log(json))

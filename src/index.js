import $ from 'jquery'

export default class AsyncFn {
  static initClass() {
    this.setImmediate = (function() {
      let head = {}
      let tail = head
      const ID = Math.random()

      const onmessage = function(e) {
        if ((e.data != null ? e.data.toString() : undefined) !== ID.toString()) { return }
        head = head.next
        const {
          func
        } = head
        delete head.func

        return func()
      }

      if (window.addEventListener && window.postMessage) {
        window.addEventListener('message', onmessage, false)

        return function(func) {
          tail = (tail.next = {func})
          return window.postMessage(ID, '*')
        }
      } else {
        return func => setTimeout(func, 0)
      }
    })()
  }

  static addToCallQueue(fn) {
    const asyncFn = new AsyncFn(fn)

    if (this.currentFn != null) {
      this.currentFn.done(() => asyncFn.call())
    } else {
      asyncFn.call()
    }

    this.currentFn = asyncFn
    return this.currentFn
  }

  constructor(asyncFn) {
    this.dfd = new $.Deferred()
    this.fn = asyncFn
  }

  done(callback) {
    this.callback = callback
    if (this.isCalled) { this.callback() }
  }

  call() {
    if (this.isCalled) { return }
    return this.fn().always(() => {
      this.isCalled = true
      this.dfd.resolve()
      if (this.callback) { this.callback() }
    })
  }
}

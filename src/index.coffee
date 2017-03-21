{$} = require('./libs')

module.exports = class window.AsyncFn
  constructor: (asyncFn) ->
    @dfd = new $.Deferred()
    @fn = asyncFn

  done: (callback) ->
    @callback = callback
    @callback() if @isCalled

  call: ->
    return if @isCalled
    @fn().always =>
      @isCalled = true
      @dfd.resolve()
      @callback() if @callback

  @addToCallQueue: (fn) ->
    asyncFn = new AsyncFn(fn)

    if @currentFn?
      @currentFn.done -> asyncFn.call()
    else
      asyncFn.call()

    @currentFn = asyncFn

  @setImmediate = do ->
    head = {}
    tail = head
    ID = Math.random()

    onmessage = (e) ->
      data = e.data || ''
      return if data.toString() isnt ID.toString()

      head = head.next
      func = head.func
      delete head.func

      func()

    if window.addEventListener and window.postMessage
      window.addEventListener 'message', onmessage, false

      return (func) ->
        tail = tail.next = {func}
        window.postMessage(ID, '*')
    else
      return (func) ->
        setTimeout(func, 0)

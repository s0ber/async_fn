class window.AsyncFn

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
      @currentFn.done => asyncFn.call()
    else
      asyncFn.call()

    @currentFn = asyncFn

  @setImmediate = do ->
    head = {}
    tail = head
    ID = Math.random()

    onmessage = (e) ->
      return if e.data.toString() isnt ID.toString()
      head = head.next
      func = head.func
      delete head.func

      func()

    if window.addEventListener
      window.addEventListener "message", onmessage, false
    else
      window.attachEvent "onmessage", onmessage

    if window.postMessage
      (func) ->
        tail = tail.next = { func }
        window.postMessage(ID, "*")
    else
      (func) ->
        setTimeout(func, 0)

modula.export('async_fn', AsyncFn)

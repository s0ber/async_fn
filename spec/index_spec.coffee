$ = require 'jquery'
AsyncFn = require '../src/index'

describe 'AsyncFn', ->
  beforeEach ->
    @dfd = null
    @fn = sinon.spy(=>
      @dfd = new $.Deferred()
      @dfd.promise()
    )

    @asyncFn = new AsyncFn(@fn)

  describe '#constructor', ->
    it 'saves provided function in @fn', ->
      expect(@asyncFn.fn).to.be.equal @fn

  describe '#done', ->
    it 'saves provided "when called" callback in @callback', ->
      anotherFn = sinon.spy()
      @asyncFn.done anotherFn
      expect(@asyncFn.callback).to.be.equal anotherFn

    context '@fn is called', ->
      it 'automatically calls provided callback', ->
        anotherFn = sinon.spy()
        @asyncFn.isCalled = true
        @asyncFn.done anotherFn
        expect(@asyncFn.callback).to.be.calledOnce

    context '@fn is not called', ->
      it "doesn't call provided callback", ->
        anotherFn = sinon.spy()
        @asyncFn.done anotherFn
        expect(@asyncFn.callback).to.be.not.called

  describe '#call', ->
    it 'calls @fn', ->
      @asyncFn.call()
      expect(@fn).to.be.calledOnce

    it 'does nothing if already called', ->
      @asyncFn.isCalled = true
      @asyncFn.call()
      expect(@fn).to.be.not.called

    it 'calls @callback when @fn is resolved', ->
      anotherFn = sinon.spy()

      @asyncFn.done(anotherFn)
      @asyncFn.call()
      expect(@asyncFn.callback).to.be.not.called
      @dfd.resolve().then =>
        expect(@asyncFn.isCalled).to.be.true

  describe '.setImmediate', ->
    it 'does not break on external message', (done) ->
      window.postMessage(null, '*')
      setTimeout(done, 100)

  describe '.addToCallQueue', ->
    beforeEach ->
      @asyncFn1 = sinon.spy(->
        dfd = new $.Deferred()
        setTimeout ->
          dfd.resolve()
        , 700
        dfd.promise()
      )

      @asyncFn2 = sinon.spy(->
        dfd = new $.Deferred()
        setTimeout ->
          dfd.resolve()
        , 300
        dfd.promise()
      )

      @asyncFn3 = sinon.spy(->
        dfd = new $.Deferred()
        setTimeout ->
          dfd.resolve()
        , 100
        dfd.promise()
      )

    it 'calls callbacks in a queue one by one', (done) ->
      AsyncFn.addToCallQueue @asyncFn1
      AsyncFn.addToCallQueue @asyncFn2
      AsyncFn.addToCallQueue @asyncFn3

      expect(@asyncFn2).to.be.not.called
      expect(@asyncFn3).to.be.not.called

      setTimeout =>
        expect(@asyncFn1).to.be.calledOnce
        expect(@asyncFn2).to.be.calledOnce
        expect(@asyncFn3).to.be.calledOnce
        expect(@asyncFn1).to.be.calledBefore @asyncFn2
        expect(@asyncFn2).to.be.calledBefore @asyncFn3
        done()
      , 1500

    it 'allows to add after call callbacks', (done) ->
      @asyncFn1After = sinon.spy()
      @asyncFn2After = sinon.spy()
      @asyncFn3After = sinon.spy()

      AsyncFn.addToCallQueue(@asyncFn1).dfd.done @asyncFn1After
      AsyncFn.addToCallQueue(@asyncFn2).dfd.done @asyncFn2After
      AsyncFn.addToCallQueue(@asyncFn3).dfd.done @asyncFn3After

      setTimeout =>
        expect(@asyncFn1).to.be.calledBefore @asyncFn1After
        expect(@asyncFn1After).to.be.calledBefore @asyncFn2
        expect(@asyncFn2).to.be.calledBefore @asyncFn2After
        expect(@asyncFn2After).to.be.calledBefore @asyncFn3
        expect(@asyncFn3).to.be.calledBefore @asyncFn3After
        done()
      , 1500

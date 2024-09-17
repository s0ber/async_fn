/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
import $ from 'jquery'
import AsyncFn from '../src/index'

describe('AsyncFn', () => {
  let dfd
  let asyncFn
  let fn

  beforeEach(() => {
    fn = jest.fn(() => {
      dfd = new $.Deferred()
      return dfd.promise()
    })

    asyncFn = new AsyncFn(fn)
  })

  describe('#constructor', () => {
    it('saves provided function in @fn', () => {
      expect(asyncFn.fn).toBe(fn)
    })
  })

  describe('#done', () => {
    it('saves provided "when called" callback in @callback', () => {
      const anotherFn = jest.fn()
      asyncFn.done(anotherFn)
      expect(asyncFn.callback).toBe(anotherFn)
    })

    describe('@fn is called', () => {
      it('automatically calls provided callback', () => {
        const anotherFn = jest.fn()
        asyncFn.isCalled = true
        asyncFn.done(anotherFn)
        expect(asyncFn.callback).toHaveBeenCalledTimes(1)
      })
    })

    describe('@fn is not called', () => {
      it("doesn't call provided callback", () => {
        const anotherFn = jest.fn()
        asyncFn.done(anotherFn)
        expect(asyncFn.callback).not.toHaveBeenCalled()
      })
    })
  })

  describe('#call', () => {
    it('calls @fn', () => {
      asyncFn.call()
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('does nothing if already called', () => {
      asyncFn.isCalled = true
      asyncFn.call()
      expect(fn).not.toHaveBeenCalled()
    })

    it('calls @callback when @fn is resolved', () => {
      const anotherFn = jest.fn()

      asyncFn.done(anotherFn)
      asyncFn.call()
      expect(asyncFn.callback).not.toHaveBeenCalled()

      return dfd.resolve().then(() => {
        expect(asyncFn.isCalled).toBe(true)
      })
    })
  })

  describe('.setImmediate', () => {
    it('does not break on external message', function(done) {
      window.postMessage(null, '*')
      setTimeout(done, 100)
    })
  })

  describe('.addToCallQueue', () => {
    beforeEach(() => {
      asyncFn1 = jest.fn(() => {
        const dfd = new $.Deferred()
        setTimeout(() => dfd.resolve()
        , 700)
        return dfd.promise()
      })

      asyncFn2 = jest.fn(() => {
        const dfd = new $.Deferred()
        setTimeout(() => dfd.resolve()
        , 300)
        return dfd.promise()
      })

      asyncFn3 = jest.fn(() => {
        const dfd = new $.Deferred()
        setTimeout(() => dfd.resolve(), 100)
        return dfd.promise()
      })
    })

    it('calls callbacks in a queue one by one', function(done) {
      AsyncFn.addToCallQueue(asyncFn1)
      AsyncFn.addToCallQueue(asyncFn2)
      AsyncFn.addToCallQueue(asyncFn3)

      expect(asyncFn2).not.toHaveBeenCalled()
      expect(asyncFn3).not.toHaveBeenCalled()

      setTimeout(() => {
        expect(asyncFn1).toHaveBeenCalledTimes(1)
        expect(asyncFn2).toHaveBeenCalledTimes(1)
        expect(asyncFn3).toHaveBeenCalledTimes(1)
        expect(asyncFn1).toHaveBeenCalledBefore(asyncFn2)
        expect(asyncFn2).toHaveBeenCalledBefore(asyncFn3)

        done()
      }, 1500)
    })

    it('allows to add after call callbacks', function(done) {
      asyncFn1After = jest.fn()
      asyncFn2After = jest.fn()
      asyncFn3After = jest.fn()

      AsyncFn.addToCallQueue(asyncFn1).dfd.done(asyncFn1After)
      AsyncFn.addToCallQueue(asyncFn2).dfd.done(asyncFn2After)
      AsyncFn.addToCallQueue(asyncFn3).dfd.done(asyncFn3After)

      setTimeout(() => {
        expect(asyncFn1).toHaveBeenCalledBefore(asyncFn1After)
        expect(asyncFn1After).toHaveBeenCalledBefore(asyncFn2)
        expect(asyncFn2).toHaveBeenCalledBefore(asyncFn2After)
        expect(asyncFn2After).toHaveBeenCalledBefore(asyncFn3)
        expect(asyncFn3).toHaveBeenCalledBefore(asyncFn3After)

        done()
      }, 1500)
    })
  })
})

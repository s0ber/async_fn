AsyncFn
=====
[![Build Status](https://travis-ci.org/s0ber/async_fn.png?branch=master)](https://travis-ci.org/s0ber/async_fn)

## Description

This is one-method library, which main purpose is ability to run provided to this method asynchronous functions in a queue one by one.
Please notice, that all provided functions should return a promise and they should be asynchronous. Support for simple functions is not yet implemented, but planned.

### Example

Here's just a spec example.

```coffee
it 'calls callbacks in a queue one by one', (done) ->
  asyncFn1 = sinon.spy(=>
    dfd = new $.Deferred()
    setTimeout ->
      dfd.resolve()
    , 700
    dfd.promise()
  )

  asyncFn2 = sinon.spy(=>
    dfd = new $.Deferred()
    setTimeout ->
      dfd.resolve()
    , 300
    dfd.promise()
  )

  asyncFn3 = sinon.spy(=>
    dfd = new $.Deferred()
    setTimeout ->
      dfd.resolve()
    , 100
    dfd.promise()
  )

  AsyncFn.addToCallQueue asyncFn1
  AsyncFn.addToCallQueue asyncFn2
  AsyncFn.addToCallQueue asyncFn3

  expect(asyncFn2).to.be.not.called
  expect(asyncFn3).to.be.not.called

  setTimeout ->
    expect(asyncFn1).to.be.calledOnce
    expect(asyncFn2).to.be.calledOnce
    expect(asyncFn3).to.be.calledOnce
    expect(asyncFn1).to.be.calledBefore asyncFn2
    expect(asyncFn2).to.be.calledBefore asyncFn3
    done()
  , 1500
```

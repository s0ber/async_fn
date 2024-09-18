import addToCallQueue from '../src/index'

describe('addToCallQueue', () => {
  it('calls callbacks in a queue one by one', function(done) {
    const asyncFn1 = jest.fn(() =>
      new Promise((resolve) => setTimeout(resolve, 700)))

    const asyncFn2 = jest.fn(() =>
      new Promise((resolve) => setTimeout(resolve, 300)))

    const asyncFn3 = jest.fn(() =>
      new Promise((resolve) => setTimeout(resolve, 100)))

    addToCallQueue(asyncFn1)
    addToCallQueue(asyncFn2)
    addToCallQueue(asyncFn3)

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

  it('allows to add success callbacks', function(done) {
    const asyncFn1 = jest.fn(() =>
      new Promise((resolve) => setTimeout(resolve, 700)))

    const asyncFn2 = jest.fn(() =>
      new Promise((resolve) => setTimeout(resolve, 300)))

    const asyncFn3 = jest.fn(() =>
      new Promise((resolve) => setTimeout(resolve, 100)))

    const asyncFn1After = jest.fn()
    const asyncFn2After = jest.fn()
    const asyncFn3After = jest.fn()

    addToCallQueue(asyncFn1).then(asyncFn1After)
    addToCallQueue(asyncFn2).then(asyncFn2After)
    addToCallQueue(asyncFn3).then(asyncFn3After)

    setTimeout(() => {
      expect(asyncFn1).toHaveBeenCalledBefore(asyncFn1After)
      expect(asyncFn1After).toHaveBeenCalledBefore(asyncFn2)
      expect(asyncFn2).toHaveBeenCalledBefore(asyncFn2After)
      expect(asyncFn2After).toHaveBeenCalledBefore(asyncFn3)
      expect(asyncFn3).toHaveBeenCalledBefore(asyncFn3After)

      done()
    }, 1500)
  })

  it('allows to handle failed callbacks', function(done) {
    const asyncFn1 = jest.fn(() =>
      new Promise((resolve, reject) => setTimeout(reject, 700)))

    const asyncFn2 = jest.fn(() =>
      new Promise((resolve, reject) => setTimeout(reject, 300)))

    const asyncFn3 = jest.fn(() =>
      new Promise((resolve, reject) => setTimeout(reject, 100)))

    const asyncFn1After = jest.fn()
    const asyncFn2After = jest.fn()
    const asyncFn3After = jest.fn()

    addToCallQueue(asyncFn1).catch(asyncFn1After)
    addToCallQueue(asyncFn2).catch(asyncFn2After)
    addToCallQueue(asyncFn3).catch(asyncFn3After)

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

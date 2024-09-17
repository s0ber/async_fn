let queue = Promise.resolve()

export default (fn) =>
  new Promise((resolve, reject) => {
    queue = queue.then(fn).then(resolve, reject)
  })

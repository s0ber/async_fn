let queue = Promise.resolve()

const addToAsyncQueue = (fn) =>
  new Promise((resolve, reject) => {
    queue = queue.then(fn).then(resolve, reject)
  })

export default addToAsyncQueue

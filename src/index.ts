let queue = Promise.resolve()

type FnOrPromise = (...args: any[]) => void | Promise<unknown>

const addToAsyncQueue = (fn: FnOrPromise) =>
  new Promise((resolve, reject) => {
    queue = queue.then(fn).then(resolve, reject)
  })

export default addToAsyncQueue

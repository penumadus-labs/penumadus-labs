export const throttle = (fn: (...args: any[]) => any, time = 200) => {
  let timeout: NodeJS.Timer | null
  return () => {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        fn()
      }, time)
    }
  }
}

export const wait = (time = 1000) => new Promise(res => setTimeout(res, time))

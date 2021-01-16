export const throttle = (fn: (...args: any[]) => any, time = 300) => {
  let timeout: NodeJS.Timer
  return () => {
    if (!timeout) setTimeout(fn, 300)
  }
}

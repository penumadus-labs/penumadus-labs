export const max = <T>(array: T[], fn: (x: T) => number): T =>
  array.reduce((elm, x) => (fn(x) > fn(elm) ? x : elm), array[0])

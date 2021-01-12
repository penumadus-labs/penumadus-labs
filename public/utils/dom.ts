export const isBrowser = (fn: () => any) => {
  if (typeof window !== undefined) return fn()
}

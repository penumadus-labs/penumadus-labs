const isNumber = value => !isNaN(+value)

export const value = value => {
  return ((value === '' || isNumber(value)) && 1) || undefined
}

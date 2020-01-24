export const value = (value, current) => {
  if (+value === current) return 'current value already set'
  else if (isNaN(+value)) return 'invalid input'
  else if (value === '') return ''
  else return ''
}

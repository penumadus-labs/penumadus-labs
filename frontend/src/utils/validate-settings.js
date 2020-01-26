const value = (value, current) => {
  if (+value === current) return 'current value already set'
  else if (isNaN(+value)) return 'invalid input'
  else if (value === '') return ''
  else return ''
}

const handler = {
  get(target, name) {
    return target.hasOwnProperty(name) ? target[name] : value
  },
}

const cases = { value }

export default new Proxy(cases, handler)

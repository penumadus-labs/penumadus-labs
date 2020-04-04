const useTheme = cb => {
  return ({ theme }) => {
    try {
      return cb(theme)
    } catch (e) {
      return ''
    }
  }
}

export default useTheme

import React from 'react'
import { ThemeProvider } from 'styled-components'
import theme from '../../style/theme'

export default ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

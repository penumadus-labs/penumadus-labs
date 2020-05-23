import React from 'react'
import { ThemeProvider } from 'emotion-theming'
import theme from '../../style/theme'

export default ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

import React from 'react'
import ThemeProvider from './src/context/theme/theme-provider'

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
)

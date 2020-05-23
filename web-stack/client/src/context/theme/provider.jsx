import React from 'react'
import { ThemeProvider } from 'emotion-theming'
import mediaqueries from '../../style/mediaqueries'

export default ({ children }) => (
  <ThemeProvider theme={mediaqueries}>{children}</ThemeProvider>
)

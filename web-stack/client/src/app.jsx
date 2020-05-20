import React from 'react'
import Header from './layout/header'
import styled, { ThemeProvider } from 'styled-components'
import Router from './routes/router'
import theme from './style/theme'

const Root = styled.div`
  height: 100vh;
  color: ${({ theme }) => theme.color.font};
  font-size: ${({ theme }) => theme.font.size.text};
  font-family: ${({ theme }) => theme.font.family};
  letter-spacing: ${({ theme }) => theme.font.leterSpacing};
  background: ${({ theme }) => theme.color.background};
`

export default () => {
  return (
    <ThemeProvider theme={theme}>
      <Root>
        <Header />
        <Router />
      </Root>
    </ThemeProvider>
  )
}

import './src/style/global.css'
import React from 'react'
import Header from './src/layout/Header.jsx'
import styled, { ThemeProvider } from 'styled-components'
import theme from './src/style/theme'

const Root = styled.div`
  height: 100vh;
  color: ${({ theme }) => theme.color.font};
  font-size: ${({ theme }) => theme.font.size.text};
  font-family: ${({ theme }) => theme.font.family};
  letter-spacing: ${({ theme }) => theme.font.leterSpacing};
  background: ${({ theme }) => theme.color.background};
`

const wrapPageElement = ({ element, props }) => {
  console.clear()
  return (
    <ThemeProvider theme={theme}>
      <Root>
        <Header />
        {element}
      </Root>
    </ThemeProvider>
  )
}

export { wrapPageElement }

import GlobalStyle from './style/global.jsx'
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import Layout from './layout/layout'
import ContextProvider from './context/provider'

ReactDOM.render(
  <StrictMode>
    <ContextProvider>
      <GlobalStyle />
      <Layout />
    </ContextProvider>
  </StrictMode>,
  document.getElementById('root')
)

import GlobalStyle from './style/global.jsx'
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import Header from './layout/header'
import Router from './routes/router'
import ContextProvider from './context/provider'

ReactDOM.render(
  <StrictMode>
    <GlobalStyle />
    <ContextProvider>
      <Header />
      <Router />
    </ContextProvider>
  </StrictMode>,
  document.getElementById('root')
)

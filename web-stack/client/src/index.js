import './style/global.css'
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import ContextProvider from './context/provider'

ReactDOM.render(
  <StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </StrictMode>,
  document.getElementById('root')
)

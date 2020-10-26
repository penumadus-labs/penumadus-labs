import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import App from './app/layout'
import { ApiProvider } from './api'
import Style from './style/global.jsx'

ReactDOM.render(
  <StrictMode>
    <Style>
      <ApiProvider>
        <App />
      </ApiProvider>
    </Style>
  </StrictMode>,
  document.getElementById('root')
)

import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import App from './app/layout'
import Style from './style/global.jsx'
import { ApiProvider } from './context/api'

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

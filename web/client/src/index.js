import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import App from './app/layout'
import { ApiProvider } from './api'
import Style from './style/global.jsx'
import ErrorBoundary from './components/error-boundary'

ReactDOM.render(
  <StrictMode>
    <Style>
      <ErrorBoundary card={true}>
        <ApiProvider>
          <App />
        </ApiProvider>
      </ErrorBoundary>
    </Style>
  </StrictMode>,
  document.getElementById('root')
)

import React from 'react'
import ThemeProvider from './theme/provider'
import { AuthProvider } from './auth/context'
import { DatabaseProvider } from './database/context'
import { DevicesProvider } from './devices/context'

export default ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DatabaseProvider>
          <DevicesProvider>{children}</DevicesProvider>
        </DatabaseProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

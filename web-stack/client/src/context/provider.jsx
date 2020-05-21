import React from 'react'
import ThemeProvider from './theme/provider'
import { AuthProvider } from './auth/context'
import { DatabaseProvider } from './database/context'
// import { DeviceProvider } from './device/context'

export default ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DatabaseProvider>
          {children}
          {/* <DeviceProvider>{children}</DeviceProvider> */}
        </DatabaseProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

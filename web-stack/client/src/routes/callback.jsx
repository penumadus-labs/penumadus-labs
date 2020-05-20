import React, { useEffect } from 'react'

import { handleAuthentication } from '../utils/auth'

export default () => {
  useEffect(() => {
    handleAuthentication()
  })
  return <p>loading...</p>
}

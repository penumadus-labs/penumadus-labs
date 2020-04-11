import { useEffect } from 'react'

import { logout } from '../../utils/auth'

export default () => {
  useEffect(() => {
    logout()
    return () => {}
  })

  return null
}

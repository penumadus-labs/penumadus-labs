import React /* , { useState } */ from 'react'
import { Router } from '@reach/router'
import styled from '@emotion/styled'
import ChartControls from './controls/chart-controls'
import useSocket from '../hooks/use-socket'

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .router {
    justify-self: center;
  }
`

export default ({ loggedIn }) => {
  const status = useSocket()
  // const devices = ['unit_3', 'unit_2', 'unit_1']
  // const [selected, setSelected] = useState(devices[0])
  // const handleSelect = ({ target }) => {
  //   setSelected(target.value)
  // }

  return loggedIn ? (
    <Menu className="card">
      {status}
      <Router className="router">
        <ChartControls path="/charts" />
      </Router>
    </Menu>
  ) : null
}

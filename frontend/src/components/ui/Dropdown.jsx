import React from 'react'
import { Select } from 'semantic-ui-react'
import Card from '../Card.jsx'

const devices = ['device1', 'device2', 'device3']

const options = devices.map(device => ({
  key: device,
  text: device,
  value: device,
}))

export default () => (
  <Card>
    select device: <Select placeholder='default device' options={options} />
  </Card>
)

import React from 'react'
import { Select } from 'semantic-ui-react'

const devices = ['device1', 'device2', 'device3']

const options = devices.map(device => ({
  key: device,
  text: device,
  value: device,
}))

export default () => (
  <div>
    select device: <Select placeholder='default device' options={options} />
  </div>
)

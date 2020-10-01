import React from 'react'
import { FiHelpCircle as Help } from 'react-icons/fi'
import Alert from '../../../alert'

export default () => (
  <Alert icon={<Help size="20" />}>
    <p>use the gear to set the display domain</p>
    <p>use the download button to get the current view as a csv</p>
    <p>click the camera to toggle live data collection</p>
    <br />
    <p>click the chart drag to select an area of the chart</p>
    <p>use apply to expand that area</p>
    <p>use undo to undo previous brush</p>
    <p>use reset to return to default view</p>
  </Alert>
)

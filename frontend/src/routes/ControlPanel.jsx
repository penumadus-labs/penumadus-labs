import React, { useState } from 'react'
import Card from '../components/Card.jsx'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import Alert from '../components/ui/Alert.jsx'
import useAsync from '../hooks/use-async'
import useInput from '../hooks/use-input'

export default () => {
  const [alert, setAlert] = useState(false)

  let settings = useAsync('')

  settings = {
    hum: 50,
    temp: 50,
  }

  const [temp, bindTemp] = useInput()
  const [hum, bindHum] = useInput()

  const handleSubmit = e => {
    e.preventDefault()
    setAlert(true)
  }

  const handleCancel = () => {
    setAlert(false)
  }
  const handleAccept = () => {
    setAlert(false)
  }

  return (
    <>
      <form>
        <Input
          name='temp'
          value={temp}
          current={settings.temp}
          unit='units'
          {...bindTemp}
        />
        <Input
          name='hum'
          value={hum}
          current={settings.hum}
          unit='units'
          {...bindHum}
        />
        <Card>
          <Button onClick={handleSubmit}>Apply</Button>
        </Card>
      </form>
      {alert && (
        <Alert onAccept={handleAccept} onCancel={handleCancel}>
          <p>summary</p>
          <p>
            humidity: {settings.hum}unit => {hum}unit
          </p>
          <p>
            tempurature: {settings.temp}unit => {temp}unit
          </p>
        </Alert>
      )}
    </>
  )
}

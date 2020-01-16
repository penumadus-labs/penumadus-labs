import React from 'react'
import Input from '../components/ui/Input.jsx'
import useInput from '../hooks/use-input'

export default () => {
  const [temp, bindTemp] = useInput()
  const [hum, bindHum] = useInput()
  return (
    <>
      <form>
        <Input name='temp' value={temp} {...bindTemp} />
        <Input name='hum' value={hum} {...bindHum} />
      </form>
    </>
  )
}

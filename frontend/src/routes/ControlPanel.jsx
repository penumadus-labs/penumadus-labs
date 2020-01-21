import React, { useState } from 'react'
import styled from 'styled-components'
import Card from '../components/Card.jsx'
import Setting from '../components/ui/Setting.jsx'
import Button from '../components/ui/Button.jsx'
import Alert from '../components/ui/Alert.jsx'
// import useAsync from '../hooks/use-async'
import useSetting from '../hooks/use-setting'

const Root = styled.div`
  form {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-left: ${({ theme }) => theme.spacing.sm};

    > * {
      ${({ theme }) => theme.mediaQueries.layout} {
        flex-basis: 33%;
      }
      flex: 1 1 20%;
      margin-right: ${({ theme }) => theme.spacing.sm};
    }
  }

  .warning {
    margin-top: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.color.red};
  }
`

export default () => {
  // hooks
  const [alert, setAlert] = useState(false)
  const [warning, setWarning] = useState('')

  const valueProps = [
    'value1',
    'value2',
    'value3',
    'value4',
    'value5',
    'value6',
    'value7',
    'value8',
  ].map(useSetting)

  // methods

  const handleSubmit = e => {
    if (valueProps.every(({ props }) => props.value === '')) {
      setWarning('no valus entered')
    } else if (valueProps.some(({ props }) => props.warning)) {
      setWarning('invalid input')
    } else {
      setWarning('')
      setAlert(true)
    }
  }

  const handleCancel = () => {
    setAlert(false)
  }
  const handleAccept = () => {
    setAlert(false)
    const result = valueProps.reduce((acc, { name, value, current }) => {
      acc[name] = value === '' ? current : +value
      return acc
    }, {})
    console.log(result)
    valueProps.forEach(({ reset }) => reset())
  }

  // components

  const Summary = () => (
    <>
      <p>summary</p>
      {valueProps.map(({ props: { name, value, current, unit } }) => {
        return value === '' ? null : (
          <p key={name}>
            {name}: {current + unit} => {value + unit}
          </p>
        )
      })}
    </>
  )

  return (
    <>
      <Root>
        <form>
          {valueProps.map(({ props }) => (
            <Setting {...props} key={props.name} />
          ))}
        </form>
        <Card>
          <Button onClick={handleSubmit}>Apply</Button>
          {warning && <p className='warning'>{warning}</p>}
        </Card>
      </Root>
      {alert && (
        <Alert onAccept={handleAccept} onCancel={handleCancel}>
          <Summary />
        </Alert>
      )}
    </>
  )
}

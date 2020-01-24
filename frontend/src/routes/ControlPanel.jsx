import React, { useState } from 'react'
import styled from 'styled-components'
import Card from '../components/Card.jsx'
import Setting from '../components/ui/Setting.jsx'
import Button from '../components/ui/Button.jsx'
import Alert from '../components/ui/Alert.jsx'
import useSettings from '../hooks/use-settings'

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
  const [settings, update] = useSettings()

  // methods

  const handleSubmit = e => {
    if (settings.every(({ props }) => props.value === '')) {
      setWarning('no valus entered')
    } else if (settings.some(({ props }) => props.warning)) {
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
    const result = settings.reduce(
      (acc, { props: { name, current, value, unit } }) => {
        acc[name] = {
          name,
          unit,
          value: value === '' ? current : +value,
        }
        return acc
      },
      {}
    )
    settings.forEach(({ reset }) => reset())
    update(result)
  }

  // components

  const Summary = () => (
    <>
      <p>summary</p>
      {settings.map(({ props: { name, value, current, unit } }) => {
        return value === '' ? null : (
          <p key={name}>
            {name}: {current + unit} => {value + unit}
          </p>
        )
      })}
    </>
  )

  return (
    settings && (
      <>
        <Root>
          <form>
            {settings.map(({ props }) => (
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
  )
}

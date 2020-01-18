import React, { useState } from 'react'
import styled from 'styled-components'
import Card from '../components/Card.jsx'
import InputValue from '../components/ui/InputValue.jsx'
import Button from '../components/ui/Button.jsx'
import Alert from '../components/ui/Alert.jsx'
// import useAsync from '../hooks/use-async'
import useInput from '../hooks/use-input'
import * as validate from '../utils/validate-values.js'

const Root = styled.div`
  form {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-right: ${({ theme }) => theme.spacing.sm};
    margin-left: ${({ theme }) => theme.spacing.sm};

    > * {
      ${({ theme }) => theme.mediaQueries.layout} {
        width: 49.5%;
      }
      width: 24.5%;
      margin-right: 0;
      margin-left: 0;
    }
  }

  .helper {
    margin-top: ${({ theme }) => theme.spacing.sm};
  }

  .warn {
    color: ${({ theme }) => theme.color.red};
  }
`

export default () => {
  const [alert, setAlert] = useState(false)
  const [helper, setHelper] = useState(false)
  const [warn, setWarn] = useState(false)

  const settings = {
    value1: 50,
    value2: 50,
    value3: 50,
    value4: 50,
    value5: 50,
    value6: 50,
    value7: 50,
    value8: 50,
  }

  const [value1, value1Bind, value1Reset] = useInput()
  const [value2, value2Bind, value2Reset] = useInput()
  const [value3, value3Bind, value3Reset] = useInput()
  const [value4, value4Bind, value4Reset] = useInput()
  const [value5, value5Bind, value5Reset] = useInput()
  const [value6, value6Bind, value6Reset] = useInput()
  const [value7, value7Bind, value7Reset] = useInput()
  const [value8, value8Bind, value8Reset] = useInput()

  const valueProps = [
    {
      name: 'value1',
      value: value1,
      current: settings.value1,
      unit: 'unit',
      bind: value1Bind,
      isvalid: validate.value(value1),
    },
    {
      name: 'value2',
      value: value2,
      current: settings.value2,
      unit: 'unit',
      bind: value2Bind,
      isvalid: validate.value(value2),
    },
    {
      name: 'value3',
      value: value3,
      current: settings.value3,
      unit: 'unit',
      bind: value3Bind,
      isvalid: validate.value(value3),
    },
    {
      name: 'value4',
      value: value4,
      current: settings.value4,
      unit: 'unit',
      bind: value4Bind,
      isvalid: validate.value(value4),
    },
    {
      name: 'value5',
      value: value5,
      current: settings.value5,
      unit: 'unit',
      bind: value5Bind,
      isvalid: validate.value(value5),
    },
    {
      name: 'value6',
      value: value6,
      current: settings.value6,
      unit: 'unit',
      bind: value6Bind,
      isvalid: validate.value(value6),
    },
    {
      name: 'value7',
      value: value7,
      current: settings.value7,
      unit: 'unit',
      bind: value7Bind,
      isvalid: validate.value(value7),
    },
    {
      name: 'value8',
      value: value8,
      current: settings.value8,
      unit: 'unit',
      bind: value8Bind,
      isvalid: validate.value(value8),
    },
  ]

  const handleSubmit = e => {
    // e.preventDefault()
    setHelper(false)
    setWarn(false)

    console.log(valueProps.some(({ isvalid }) => !isvalid))

    if (valueProps.every(({ value }) => value === '')) {
      setHelper(true)
    } else if (valueProps.some(({ isvalid }) => !isvalid)) {
      setWarn(true)
    } else setAlert(true)
  }

  const handleCancel = () => {
    setAlert(false)
  }
  const handleAccept = () => {
    setAlert(false)
    const result = valueProps.reduce((acc, { name, value, current }) => {
      acc[name] = value === '' ? current : value
      return acc
    }, {})
    console.log(result)
    value1Reset()
    value2Reset()
    value3Reset()
    value4Reset()
    value5Reset()
    value6Reset()
    value7Reset()
    value8Reset()
  }

  return (
    <>
      <Root>
        <form>
          {valueProps.map(props => (
            <InputValue {...props} key={props.name} />
          ))}
        </form>
        <Card>
          <Button onClick={handleSubmit}>Apply</Button>
          {helper && <p className='helper'>no values entered</p>}
          {warn && <p className='helper warn'>invalid input</p>}
        </Card>
      </Root>
      {alert && (
        <Alert onAccept={handleAccept} onCancel={handleCancel}>
          {valueProps.map(props => (
            <Summary {...props} key={props.name} />
          ))}
        </Alert>
      )}
    </>
  )
}

const Summary = ({ name, value, current, unit }) =>
  value === '' ? null : (
    <p>
      {name}: {current + unit} => {value + unit}
    </p>
  )

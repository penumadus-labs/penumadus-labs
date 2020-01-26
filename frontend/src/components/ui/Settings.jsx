import React from 'react'
import styled from 'styled-components'
import Card from '../Card.jsx'
import Button from './Button.jsx'
import Setting from './Setting.jsx'

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

export default ({ list, onSubmit, warning }) => (
  <Root>
    <form>
      {list.map(props => (
        <Setting {...props} key={props.name} />
      ))}
    </form>
    <Card>
      <Button onClick={onSubmit}>Apply</Button>
      {warning && <p className='warning'>{warning}</p>}
    </Card>
  </Root>
)

import styled from 'styled-components'

const Warning = styled.p`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.color.red};
`

export default Warning

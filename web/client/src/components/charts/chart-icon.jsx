import React from 'react'
import styled from '@emotion/styled'

export default ({ Icon, tooltip }) => {
  return (
    <IconContainer>
      <Icon size="20" />
      {tooltip ? <ToolTip className="card">{tooltip}</ToolTip> : null}
    </IconContainer>
  )
}

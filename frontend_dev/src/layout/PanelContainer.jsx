import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const css = makeStyles({
  root: {
    display: 'flex',
    '& > *': {
      margin: 'auto',
    },
  },
})

const PanelContainer = ({ children }) => (
  <div className={css().root}>{children}</div>
)

export default PanelContainer

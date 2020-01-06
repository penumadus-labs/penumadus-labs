import React from 'react'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

const css = makeStyles({
  root: {
    border: '1px solid red',
  },
})

const Btn = ({ onClick, children }) => (
  <Button
    className={css().root}
    color="primary"
    variant="contained"
    onClick={onClick}
  >
    {children}
  </Button>
)

export default Btn

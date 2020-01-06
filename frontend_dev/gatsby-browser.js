import React from 'react'
import Layout from './src/layout/Layout'

const wrapPageElement = ({ element, props }) => {
  // console.clear()
  return <Layout {...props}>{element}</Layout>
}

export { wrapPageElement }

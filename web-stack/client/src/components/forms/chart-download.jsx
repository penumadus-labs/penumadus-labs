import React from 'react'
import { parseDomain } from '../../utils/datetime'
import useDatabase from '../../context/database/context'

export default ({ getDomain }) => {
  const domain = parseDomain(getDomain())
  useDatabase()
  return (
    <div className="space-children-y">
      <p className="title">donwload selected domain</p>
      <p>{domain}</p>
    </div>
  )
}

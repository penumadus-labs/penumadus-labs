import React from 'react'
// import SettingsPanel from '../components/ui/settings-panel'
import Settings from '../components/forms/settings'
import Command from '../components/ui/command'

export default () => {
  return (
    <>
      <Settings />
      <div className="card">
        <Command />
      </div>
    </>
  )
}

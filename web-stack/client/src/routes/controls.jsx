import React from 'react'
// import SettingsPanel from '../components/ui/settings-panel'
import Settings from '../components/forms/settings'
import Command from '../components/ui/command'
import useDevices from '../context/devices/context'

export default () => {
  const [{ loading, commands, setters }, { sendCommand }] = useDevices()

  if (loading) return <p className="card loading">loading...</p>

  return (
    <>
      <div className="card space-children-x">
        {commands.map((command, i) => (
          <Command key={i} {...command} sendCommand={sendCommand} />
        ))}
      </div>
      {setters.map((setter, i) => (
        <Settings key={i} {...setter} sendCommand={sendCommand} />
      ))}
    </>
  )
}

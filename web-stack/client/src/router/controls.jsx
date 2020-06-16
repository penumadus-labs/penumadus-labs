import React from 'react'
import Setting from '../components/forms/setting'
import Command from '../components/inputs/command'
import useDevices from '../context/devices/context'

export default () => {
  const [
    { loading, commands, setters, settings },
    { sendCommand },
  ] = useDevices()

  if (loading) return <p className="card loading">loading...</p>

  return (
    <div className="main">
      {settings ? (
        <>
          <div className="card grid-commands">
            {commands.map((command, i) => (
              <Command key={i} {...command} sendCommand={sendCommand} />
            ))}
          </div>
          {setters.map((setter, i) => (
            <Setting
              key={i}
              settings={settings[setter.dataLabel]}
              sendCommand={sendCommand}
              {...setter}
            />
          ))}
        </>
      ) : (
        <p className="card loading">Trying to connect...</p>
      )}
    </div>
  )
}

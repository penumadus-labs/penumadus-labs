import React from 'react'
import Setting from '../components/forms/device-setting'
import Command from '../components/inputs/command'
import useApi from '../context/api'

export default () => {
  const [
    {
      protocol: [status, protocol],
      settings: [, settings],
    },
    { useSendCommand, useSendSetting },
  ] = useApi()

  if (status) return status
  if (!protocol) return null

  const { commands, setters } = protocol

  return (
    <>
      {settings ? (
        <>
          <div className="card grid-commands">
            {commands.map((command, i) => (
              <Command key={i} {...command} useSendCommand={useSendCommand} />
            ))}
          </div>
          {setters.map((setter, i) => (
            <Setting
              key={i}
              {...setter}
              settings={settings[setter.dataLabel]}
              useSendCommand={useSendSetting}
            />
          ))}
        </>
      ) : (
        <p className="card loading">Trying to connect...</p>
      )}
    </>
  )
}

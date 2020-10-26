import React from 'react'
import Command from '../components/controls/command'
import Setting from '../components/controls/device-setting'
import useApi from '../api'

export default () => {
  const [
    {
      protocol: [status, protocol],
      settings: [settingsStatus, settings],
    },
    { getSettings },
    { useCommand },
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
              <Command key={i} {...command} useCommand={useCommand} />
            ))}
          </div>
          {setters.map((setter, i) => (
            <Setting
              key={i}
              {...setter}
              settings={settings[setter.dataLabel]}
              useCommand={useCommand}
            />
          ))}
        </>
      ) : (
        <p className="card loading">
          If packets are being received try{' '}
          <button
            disabled={!!settingsStatus}
            className="button-text"
            style={{ cursor: 'pointer' }}
            onClick={() => getSettings({})}
          >
            <u>refreshing</u>
          </button>
        </p>
      )}
    </>
  )
}

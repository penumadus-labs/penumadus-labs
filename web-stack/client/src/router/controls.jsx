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

  const { commands = [], setters = [] } = protocol

  if (!commands.length && !setters.length)
    return (
      <div className="card">
        <p>this unit does not have settings to modify</p>
      </div>
    )

  return (
    <>
      {settings ? (
        <>
          <div className="card grid-commands">
            {commands.map(({ name }, i) => (
              <Command key={i} name={name} useCommand={useCommand} />
            ))}
          </div>
          {setters.map((setter, i) => (
            <Setting
              key={i}
              {...setter}
              settings={settings[setter.label]}
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

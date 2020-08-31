import React from 'react'
import Setting from '../components/controls/device-setting'
import Command from '../components/controls/command'
import useApi from '../context/api'

export default () => {
  const [
    {
      protocol: [status, protocol],
      settings: [, settings],
    },
    ,
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
              <Command key={i} {...command} useRequest={useSendCommand} />
            ))}
          </div>
          {setters.map((setter, i) => (
            <Setting
              key={i}
              {...setter}
              settings={settings[setter.dataLabel]}
              useRequest={useSendSetting}
            />
          ))}
        </>
      ) : (
        <p className="card loading">
          Trying to connect... if packets are being recieved try refreshing
        </p>
      )}
    </>
  )
}

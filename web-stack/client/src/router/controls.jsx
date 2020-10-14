import React from 'react'
import Command from '../components/controls/command'
import Setting from '../components/controls/device-setting'
import useApi from '../context/api'
import { GrRefresh as Refresh } from 'react-icons/gr'

export default () => {
  const [
    {
      protocol: [status, protocol],
      settings: [, settings],
    },
    { getSettings },
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
          If packets are being received try  refreshing{' '}
          <button onClick={getSettings}>
            <Refresh size="32" />
          </button>
        </p>
      )}
    </>
  )
}

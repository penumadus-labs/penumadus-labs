import React from 'react'
import Settings from '../components/forms/settings'
import Command from '../components/ui/command'
import useDevices from '../context/devices/context'

const settings = {
  ip: { ipaddr: '18.222.29.175', ipport: '32159' },
  pressure: {
    psiPreFill: '30',
    psiPostFill: '40',
    fills: '0',
    fillMax: '20',
    fullscale: '100.00',
    excitation: '5.00',
    calFactor: '3.00',
  },
  acceleration: { accelmagthresh: '3.500000' },
  sample: {
    secBetween: '10',
    sampleinterval: '50',
    accelsampint: '5',
  },
}

export default () => {
  const [{ loading, commands, setters }, { sendCommand }] = useDevices()

  if (loading) return <p className="card loading">loading...</p>

  return (
    <>
      <div className="card grid-commands">
        {commands.map((command, i) => (
          <Command key={i} {...command} sendCommand={sendCommand} />
        ))}
      </div>
      {settings
        ? setters.map((setter, i) => (
            <Settings
              key={i}
              settings={settings[setter.dataLabel]}
              sendCommand={sendCommand}
              {...setter}
            />
          ))
        : null}
    </>
  )
}

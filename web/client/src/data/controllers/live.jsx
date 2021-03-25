import React from 'react'
import { MdPlayArrow as LiveOn, MdPause as LiveOff } from 'react-icons/md'
import Tooltip from '../../components/tooltip'

export default function Live({ reducer: [{ live }, { setLive }] }) {
  const tooltip = live ? 'turn live off' : 'turn live on'
  return (
    <Tooltip text={tooltip}>
      <button className="button" onClick={setLive}>
        {live ? <LiveOff size="20" /> : <LiveOn size="20" />}
      </button>
    </Tooltip>
  )
}

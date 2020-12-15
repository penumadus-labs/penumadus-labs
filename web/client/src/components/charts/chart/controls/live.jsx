import React from 'react'
import { MdPlayArrow as LiveOn, MdPause as LiveOff } from 'react-icons/md'
import Tooltip from '../../../tooltip'

export default ({ live, toggleLive }) => {
  const tooltip = live ? 'turn live off' : 'turn live on'
  return (
    <Tooltip text={tooltip}>
      <button className="button" onClick={toggleLive}>
        {live ? <LiveOff size="20" /> : <LiveOn size="20" />}
      </button>
    </Tooltip>
  )
}

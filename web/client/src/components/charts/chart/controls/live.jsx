import React from 'react'
import { MdPlayArrow as LiveOn, MdPause as LiveOff } from 'react-icons/md'

export default ({ live, toggleLive }) => (
  <button className="button" onClick={toggleLive}>
    {live ? <LiveOff size="20" /> : <LiveOn size="20" />}
  </button>
)

import React from 'react'
import { FiVideo as Live, FiVideoOff as LiveOff } from 'react-icons/fi'

export default ({ live, toggleLive }) => (
  <button className="button" onClick={toggleLive}>
    {live ? <LiveOff size="20" /> : <Live size="20" />}
  </button>
)

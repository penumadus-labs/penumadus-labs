import { FC } from 'react'
import { HoverBox as Box } from '../components/HoverBox'
import { FillerContent } from './content'

export const FlowchartContent: FC<{ src: string }> = ({ src }) => (
  <div className="relative" style={{ background: 'green' }}>
    {<FillerContent topMargin={false} src={src} />}
    <Box top="19" left="13" width="26" height="13">
      <h1>Mold Prep</h1>
    </Box>
    <Box top="19" left="43" width="12" height="13">
      <h1>Bulk Lamination</h1>
    </Box>
    <Box top="19" left="59" width="11.5" height="13">
      <h1>Wet Out</h1>
    </Box>
    <Box top="19" left="74.5" width="12" height="13">
      <h1>Bulk Complete</h1>
    </Box>
    <Box top="50" left="70.5" width="16" height="13">
      <h1>Beam1</h1>
    </Box>
    <Box top="50" left="56" width="10" height="13">
      <h1>Beam2</h1>
    </Box>
    <Box top="50" left="41" width="11" height="13">
      <h1>Beam3</h1>
    </Box>
    <Box top="50" left="26" width="10.5" height="13">
      <h1>Beam5</h1>
    </Box>
    <Box top="50" left="12.5" width="10" height="13">
      <h1>Final Beam</h1>
    </Box>
    <Box top="82" left="16" width="19" height="7">
      <h1>Dry Fit Check</h1>
    </Box>
    <Box top="79" left="41" width="10" height="13">
      <h1>Wear Surface Photo</h1>
    </Box>
  </div>
)

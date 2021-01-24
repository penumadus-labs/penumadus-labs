import { HoverBox as Box } from '../components/HoverBox'

const magnetometerDescription = <p></p>

export const hoverDiagramContent = (
  <>
    <Box top="45" left="16.3" width="8.5" height="14" round>
      <h1>temp</h1>
      <p></p>
    </Box>
    <Box top="36" left="31" width="10.5" height="17.4" round>
      <h1>mag1</h1>
      {magnetometerDescription}
    </Box>
    <Box top="17" left="68.3" width="10.3" height="17" round>
      <h1>mag2</h1>
      {magnetometerDescription}
    </Box>
    <Box top="84" left=".6" width="11.7" height="13">
      <h1>local concentrator</h1>
      <p></p>
    </Box>
    <Box top="80" left="30" width="10" height="14">
      <h1>narrow band cellular network</h1>
      <p></p>
    </Box>
    <Box top="81.5" left="53.7" width="9.6" height="11">
      <h1>aws</h1>
      <p></p>
    </Box>
    <Box top="81.5" left="68.2" width="6.2" height="11">
      <h1>server</h1>
      <p></p>
    </Box>
    <Box top="74" left="79.6" width="11.8" height="18.8">
      <h1>web interface</h1>
      <p></p>
    </Box>
    <Box top="65.2" left="55" width="7.7" height="11">
      <h1>camera</h1>
      <p></p>
    </Box>
    <Box top="52" left="62" width="5.1" height="9.7">
      <h1>deflection/ambient temp and humidity</h1>
      <p></p>
    </Box>
    <Box top="36.3" left="86.9" width="7.1" height="16">
      <h1>strain gauge</h1>
      <p></p>
    </Box>
  </>
)

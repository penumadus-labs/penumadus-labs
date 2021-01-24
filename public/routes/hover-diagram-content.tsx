import { HoverBox as Box } from '../components/HoverBox'

const magnetometerDescription = <p></p>

export const hoverDiagramContent = (
  <>
    <Box top="45" left="22.1" width="6.9" height="10" round>
      <h1>temp</h1>
      <p></p>
    </Box>
    <Box top="39.3" left="33.5" width="8" height="11.7" round>
      <h1>mag1</h1>
      {magnetometerDescription}
    </Box>
    <Box top="26.2" left="61.7" width="8.1" height="11.8" round>
      <h1>mag2</h1>
      {magnetometerDescription}
    </Box>
    <Box top="71" left="10.2" width="9.2" height="11">
      <h1>local concentrator</h1>
      <p></p>
    </Box>
    <Box top="70" left="26.6" width="8.7" height="9">
      <h1>narrow band cellular network</h1>
      <p></p>
    </Box>
    <Box top="70" left="50.8" width="7.3" height="7.5">
      <h1>server</h1>
      <p></p>
    </Box>
    <Box top="79.5" left="52.3" width="4.8" height="7.4">
      <h1>database</h1>
      <p></p>
    </Box>
    <Box top="88" left="50" width="9.3" height="12.4">
      <h1>web interface</h1>
      <p></p>
    </Box>
    <Box top="69.9" left="60.1" width="6" height="8">
      <h1>camera</h1>
      <p></p>
    </Box>
    <Box top="50" left="57" width="4" height="7">
      <h1>deflection/ambient temp and humidity</h1>
      <p></p>
    </Box>
    <Box top="39.5" left="76.2" width="5.3" height="10.4">
      <h1>strain gauge</h1>
      <p></p>
    </Box>
  </>
)

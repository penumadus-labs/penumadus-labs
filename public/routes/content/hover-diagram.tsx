import { HoverBox as Box } from '../../components/HoverBox'

export const hoverDiagramContent = (
  <>
    <Box top="45" left="22.1" width="6.9" height="10" round leftDropdown="100">
      <h1>Temperature</h1>
      <p>
        Multiple digital temperature sensors are embedded directly in the
        composite upper and lower surfaces to track thermal cycles and uneven
        thermal stresses on the bridge deck
      </p>
    </Box>
    <Box top="39.3" left="33.5" width="8" height="11.7" round>
      <h1>Accelerometer & Magnetometer</h1>
      <p>
        Multiple 3 Axis magnetometers & accelerometers are embedded in voids in
        structure under the deck. The magnetometers cooperate to avoid false
        triggers while counting vehicles directly through the composite deck.
        The accelerometers search for threshold events and provide 20mS
        resolution envelope profiles to the archive for analysis.
      </p>
    </Box>
    <Box top="26.2" left="61.7" width="8.1" height="11.8" round>
      <h1>Accelerometer & Magnetometer</h1>
      <p>
        Multiple 3 Axis magnetometers & accelerometers are embedded in voids in
        structure under the deck. The magnetometers cooperate to avoid false
        triggers while counting vehicles directly through the composite deck.
        The accelerometers search for threshold events and provide 20mS
        resolution envelope profiles to the archive for analysis.
      </p>
    </Box>
    <Box top="71" left="10.2" width="9.2" height="11" leftDropdown="200">
      <h1>Local Concentrator</h1>
      <p>
        The local concentrator creates and manages the wireless sensor network,
        relays data via traditional wireless or narrowband LTE in remote areas,
        and records data if no communications are present. The concentrator can
        also accept commands from the admin console or software running in the
        cloud interface.
      </p>
    </Box>
    <Box top="70" left="26.6" width="8.7" height="9">
      <h1>Narrow Band Cellular Network</h1>
      <p>
        A custom Narrow Band LTE interface is incorporated in the concentrator.
        This interface accesses the new AT&T CAT-M1 wireless backbone to cost
        effectively transport data to the Amazon Cloud from remote or mobile
        locations where traditional cellular is unavailable.
      </p>
    </Box>
    <Box top="70" left="50.8" width="7.3" height="7.5">
      <h1>Server</h1>
      <p>
        Multiple secure servers are run virtually in the Amazon cloud to accept
        and archive data from multiple field deployments and return commands to
        sensor networks on the bridge. The entire system may be distributed
        across multiple servers for load balancing and reliability.
      </p>
    </Box>
    <Box top="79.5" left="52.3" width="4.8" height="7.4">
      <h1>Database</h1>
      <p>
        An sql compatible mongo database holds all data and configuration. Data
        is timestamped to the microsecond and open interfaces allow data
        analytics tools and AI engines to analyze data independent of the
        collection and conditioning software.
      </p>
    </Box>
    <Box top="88" left="50" width="9.3" height="12.4">
      <h1>Web interface</h1>
      <p>
        A custom web interface for data analytics has been designed to let
        researches look search data, view it graphically, and extract it for
        further analysis. This interface also provides the ability to monitor
        and push commands to the bridge to change sampling parameters and check
        on overall health of the wireless sensor network
      </p>
    </Box>
    <Box top="69.9" left="60.1" width="6" height="8">
      <h1>Camera</h1>
      <p>
        A custom camera solution monitors the bridge in real time and
        simultaneous records and timestamps motion events. This allows events in
        the database to have associated video to observe exactly what was
        occurring in the event of an anomaly. Or to look up data based on an
        observed video event. All clocks are synchronized for accurate retrieval
      </p>
    </Box>
    <Box top="50" left="57" width="4" height="7">
      <h1>Deflection Ambient Temp & Humidity</h1>
      <p>
        A hall effect deflection sensor is positioned under the bridge deck to
        monitor absolute flex offset to sub millimeter levels during vehicle
        passage. Data is recorded at 20mS intervals to give a time domain
        profile. This sensor also incorporates local air temperature and
        humidity under the bridge
      </p>
    </Box>
    <Box top="39.5" left="76.2" width="5.3" height="10.4" leftDropdown="-250">
      <h1>Strain Gauge</h1>
      <p>
        Multiple Strain Gauges are placed on metallic members to record offsets
        of the supporting members independent of the deck during load events
      </p>
    </Box>
    <style jsx>{`
       {
        /* h1 {
        color: yellow;
        text-decoration: underline;
        font-size: x-large;
        background-color: blue;
      }
      p {
        color: yellow;
        font-size: large;
        background-color: blue;
      } */
      }
    `}</style>
  </>
)

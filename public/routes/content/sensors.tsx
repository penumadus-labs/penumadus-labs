export const content1 = (
  <>
    <p>
      A team of researchers at the University of Tennessee’s Fibers and
      Composites Manufacturing Facility and Joint Institute for Advance
      Materials is working with IACMI and the bridge project team to equip the
      new FRP bridge deck with high-density fiber optic sensors and a
      state-of-the-art wireless sensor module system to monitor the composite
      bridge deck system while in-service.
    </p>
    <h1>Optical Sensors:</h1>
    <p>
      Composed of high density optic fiber and fiber bragg grating sensors
      developed by Luna Inc. A single 10-meter sensor can provide strain from
      mechanical loading or thermal/hygroscopic loading from thousands of
      locations simultaneously with exceptional precision. These are easy to
      install while composite decks are manufactured and become part of the
      structural component. Because of its expense and susceptibility to theft
      or damage, the optical system interface is not employed continuously but
      is easily attached and activated on demand.
    </p>
    <h1>Wireless Sensors:</h1>
    <p>
      Wireless technology developed at the University of Tennessee is being
      utilized to continuously monitor the response of the bridge system.
      Because of its low cost and protected position embedded in the bridge
      structure, the wireless sensing system can be continuously active. A
      narrowband LTE wireless interface transports the data to a cloud database
      system where it is archived for subsequent analysis by human and automated
      tools to rapidly identify variation from nominal conditions. Any
      variations would then trigger a more detailed analysis by the fiber
      system.
    </p>
    <p>
      Lack of durability data is one of the major barriers of the adoption of
      novel and advance materials including carbon, basalt, or glass fiber
      reinforced polymeric composites in civil infrastructure. This is a major
      obstacle for integrating new materials and structures quickly and thus
      require successful demonstration as being done through this IACMI project.
      Bridge decks are the most damage prone elements. The optical and
      electronic instrumentation created by this project team will provide
      valuable performance data in real time for years to come.
    </p>
    <h1>Wireless Sensing System Specifics…</h1>
    <p>
      The Wireless Sensing System utilizes an array of electronic and
      electro-mechanical sensors with individual wireless controllers in
      <em>unique configurations</em> enabled by the composite construction of
      the bridge deck.
    </p>
    <div className="flex cols-3">
      <img src="slides/acceleration.png" alt="" />
      <img src="slides/deck-deflection.png" alt="" />
      <img src="slides/temperature-humidity.png" alt="" />
    </div>
  </>
)

export const content2 = (
  <>
    <h1>Optical Sensing</h1>
    <p>
      Fiber Optic Sensor utilizes proprietary sensing technology for continuous
      and on-demand sensing for detecting strains and damage locations along the
      bridge deck panels. As an examples bridge is routinely subjected to
      tension and compressive force in response to normal vehicular traffic.
      Fiber Optic sensors are able to detect loads from vehicular traffic to
      access the health of the bridge. Tension and compressive strains along the
      bridge deck with external loading are monitored with multiple continuous
      fiber optic senses and an examples result if shown below.
    </p>
    <img src="slides/tension-example.png" alt="" className="image" />
    <img src="slides/fiber-optic-sensing1.png" alt="" />
    <img src="slides/fiber-optic-sensing2.png" alt="" />
    <img src="slides/fiber-optic-sensing3.png" alt="" />

    <h1>Ways fiber optic sensing shows what you've been missing</h1>
    <p>Small, lightweight, flexible</p>
    <p>More data, more insight</p>
    <p>Electrically passive and environmentally stable</p>
    <p>Distributes</p>
    <p>Multi-parameter</p>

    <img src="slides/fiber-optic-sensing5.png" alt="" />
    <style jsx>{`
      img {
        margin-top: 2rem;
        margin-bottom: 2rem;
        width: 100%;
        vertical-align: middle;
      }
    `}</style>
  </>
)

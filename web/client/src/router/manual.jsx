import React from 'react'
import styled from '@emotion/styled'

const StyledDiv = styled.div`
  margin: 4rem auto;
  max-width: 600px;
  h2 {
    margin-top: 4rem;
  }

  h4 {
    margin-top: 2rem;
  }

  p {
    margin-top: 1rem;
  }
`

export default function Manual() {
  return (
    <div className="card">
      <StyledDiv className="space-children-y">
        <h1>User Manual</h1>
        <h2>Activity Bar</h2>
        <p>
          At the top of the application is the activity bar. The dropdown menu
          on the left lets you choose the device whose data you want to view and
          interact with in the rest of the application. The status text on the
          right show the last received data packets for the device selected.
        </p>
        <h2>Line Charts</h2>
        <h4>Live Data View</h4>
        <p>
          The data charts have two modes: live and not live. This is controlled
          with the pause/play button. When live mode is on, the most recent data
          will be displayed and the charts will update in real time. Turning off
          live lets you analyze the data.
        </p>
        <h4>Data Analysis</h4>
        <p>
          When live view is turned off, brush controls will appear in the top
          right. Brush controls allow you to click on the chart and select an
          area to zoom in on. Reset will take you back to the original view. An
          undo will undo your last action including a reset.
        </p>
        <h4>Downloading Data</h4>
        <p>
          Each chart has a download button in the top left. The download will
          download whatever selection of data you are viewing. If you are using
          the brush tool and have zoomed in on an area. The area you have zoomed
          in on will be downloaded.
        </p>
        <h4>Deleting Data</h4>
        <p>
          All charts have a trashcan icon in the top left. The trashcan will
          clear only the data for that chart for that unit. The other unit's
          data types e.g. acceleration, environment will not be affected.
        </p>
        <h2>Environment and Deflection Data</h2>
        <h4>Selecting Data</h4>
        <p>
          Environment and deflection data is contiguous and can span a long
          period of time. In order to select the region of data you want, there
          is a gear icon at the top left visible when live is turned off. When
          the gear icon is clicked a menu will pop up allowing you to select the
          date range of the data you wish to view. You can then use the brush
          tool the analyze the data further.
        </p>
        <h2>Acceleration Data</h2>
        <h4>Selecting Events</h4>
        <p>
          Acceleration data is collected as events. Only one event at a time
          will be displayed on the chart. When live data view is turned off, a
          dropdown menu will appear in the top left that will show you the times
          of the acceleration events and let you choose which one you want to
          view.
        </p>
        <h2>Controls</h2>
        <p>
          The controls section will show the current values the selected device
          is set to. If you want to change these values you can enter the values
          you want into the forms, and click set and a dialogue will pop up
          giving you the summary and status of your request. The settings
          applied to the device will not be permanent unless you issue a commit
          settings command to the device. If you want to revert the settings
          you've picked, restarting the device will reset the device starting it
          with its last committed settings.
        </p>
        <h2>Registration</h2>
        <p>
          When registering a new device, select a name you want that device to
          be called. The request will return an configuration file that you need
          to load onto the device you are registering with an SD card. The
          configuration file contains the information the device needs in order
          to talk to the server and the database.
        </p>
      </StyledDiv>
    </div>
  )
}

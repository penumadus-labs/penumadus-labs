import React, { forwardRef } from 'react'

export default () => {
  const {
    ref,
    date,
    domain,
    defaultDownloadProps,
    toolProps,
    labels,
  } = useChart({
    data,
    ...props,
  })

  const controlProps = {
    downloadProps: {
      downloadProps: downloadProps ?? defaultDownloadProps,
      domain,
      useDownload,
    },
    deleteProps: {
      useDelete,
      getData,
    },
    liveProps: {
      live,
      toggleLive,
    },
  }

  return (
    <div className="card-spaced">
      <Global styles={SvgStyle} />
      <Header>
        <p>{date}</p>
      </Header>
      <ControlBarStyle>
        <Controls {...controlProps} render={render}>
          {children}
        </Controls>
        {!live ? <Tools {...toolProps} /> : null}
      </ControlBarStyle>
      <StyledSVG ref={ref} />
      <Legend labels={labels} />
    </div>
  )
}

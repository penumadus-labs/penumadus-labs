import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'

// console.log(d3)

export default () => {
  const ref = useRef()

  useEffect(() => {
    const res = d3
      .select(ref.current)
      .append('svg')
      .attr('width', 800)
      .attr('height', 600)
      .attr('fill', 'black')
  }, [ref])
  return <div ref={ref}></div>
}

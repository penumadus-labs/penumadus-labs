import * as d3 from 'd3'
import { formatHoursMinutes, parseDate, parseDomain } from '../../datetime'
import { colors } from '../../units-colors'

const marginLeft = 30
const marginRight = 0
const marginBottom = 50
const marginTop = 5

export default class {
  domains = []
  constructor({ keys, data, yDomain }) {
    this.data = data
    this.keys = keys
    this.yDomain = yDomain
    this.currentDomain = this.previousDomain = this.xDomain = d3.extent(
      data.map((d) => d.time)
    )
  }
  translate(height = 0) {
    return `translate(${marginLeft} ${marginTop + height})`
  }
  mount(root) {
    this.rootNode = root
    this.root = d3.select(root)
    this.render()
    let timeout
    const resize = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => this.render(), 250)
    }
    window.addEventListener('resize', resize)
    return () => {
      this.clean()
      window.removeEventListener('resize', resize)
    }
  }
  render() {
    const { width, height } = this.rootNode.getBoundingClientRect()
    this.rootWidth = width
    this.width = width - (marginLeft + marginRight)
    this.height = height - (marginBottom + marginTop)

    this.xRange = [0, this.width]

    this.x = d3.scaleLinear().domain(this.xDomain).range(this.xRange)

    this.y = d3.scaleLinear().range([this.height, 0]).domain(this.yDomain)

    this.brush = d3
      .brushX()
      .extent([
        [0, 0],
        [this.width, this.height],
      ])
      .on('end', ({ selection }) => {
        try {
          this.brushedDomain = [
            this.x.invert(selection[0]),
            this.x.invert(selection[1]),
          ]
        } catch (e) {
          /* suppress weird error if nothing is selected */
        }
      })

    // this.zoom = d3
    //   .zoom()
    //   .extent([
    //     [0, 0],
    //     [this.width, this.height],
    //   ])
    //   .scaleExtent([1, 50])
    //   .translateExtent([
    //     [0, 0],
    //     [this.width, this.height],
    //   ])
    //   .on('zoom', ({ transform }) => {
    //     this.rescaleX(transform.rescaleX(this.x))
    //   })

    this.clean()
    this.root
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', 'rgba(20, 20, 20, .35)')
      .attr('transform', this.translate())

    this.root
      .append('defs')
      .append('svg:clipPath')
      .attr('id', 'clip')
      .append('svg:rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('x', 0)
      .attr('y', 0)

    // translate inner chart view
    this.chart = this.root
      .append('g')
      .attr('transform', this.translate())
      .attr('clip-path', 'url(#clip)')

    // line data
    this.lines = this.keys.map((key) => {
      const line = d3
        .line(this.data)
        .x((d) => this.x(d.time))
        .y((d) => this.y(d[key]))

      const path = this.chart
        .append('path')
        .classed('line', true)
        .datum(this.data)
        .attr('fill', 'none')
        .attr('stroke', colors[key])
        .attr('stroke-width', 1)
        .attr('d', line)

      return [line, path]
    })

    // x axis
    this.xAxis = this.root
      .append('g')
      .classed('axis', true)
      .attr('transform', this.translate(this.height))
      .call(this.timeAxis())

    // axis ticks
    this.root
      .append('g')
      .classed('axis', true)
      .attr('transform', this.translate())
      .call(d3.axisLeft(this.y).tickSizeOuter(0))

    // axis text
    this.root
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('x', this.rootWidth / 2)
      .attr('y', this.height + marginBottom - 5)
      .text('Time (hours:minutes)')

    // tool
    this.root
      .append('g')
      .classed('brush', true)
      .attr('transform', this.translate())
      .call(this.brush)
  }
  clean() {
    this.root.selectAll('*').remove()
  }
  // setTool() {
  //   this.tool.selectAll('*').remove()
  //   this.tool
  //     .append('g')
  //     .classed('brush', true)
  //     .attr('transform', this.translate())
  //     .call(this.brush)
  //   if (tool === 'brush') {
  //   } else if (tool === 'zoom') {
  //     this.tool
  //       .append('rect')
  //       .classed('zoom', true)
  //       .attr('width', this.width)
  //       .attr('height', this.height)
  //       .attr('transform', this.translate())
  //       .attr('fill', 'none')
  //       .style('pointer-events', 'all')
  //       .call(this.zoom)
  //   }
  // }
  clearBrush() {
    try {
      this.root.select('.brush').call(this.brush.clear)
    } catch (error) {
      /* suppress weird error if nothing is selected */
    }
  }
  applyBrush = () => {
    if (!this.brushedDomain) return
    this.pushDomain(this.brushedDomain)
    this.setX(this.brushedDomain)
    this.brushedDomain = null
    this.clearBrush()
  }
  reset = () => {
    this.pushDomain()
    this.setX()
    this.clearBrush()
  }
  pushDomain(domain = this.xDomain) {
    this.domains.push(this.previousDomain)
    this.previousDomain = domain
  }

  getDomain() {
    return this.currentDomain
  }
  getDomainParsed() {
    return parseDomain(this.currentDomain)
  }

  undo = () => {
    this.clearBrush()
    if (!this.domains.length) return

    const domain = this.domains.pop()
    this.previousDomain = domain
    this.setX(domain)
  }
  getToolProps() {
    const { applyBrush, reset, undo } = this
    return { applyBrush, reset, undo }
  }
  setX(domain = this.xDomain) {
    this.currentDomain = domain
    this.x = d3.scaleLinear().domain(domain).range(this.xRange)
    this.rescaleX(this.x)
  }
  rescaleX(x) {
    this.xAxis.call(this.timeAxis())
    for (const [line, path] of this.lines) {
      line.x((d) => x(d.time))
      path.attr('d', line)
    }
  }
  timeAxis() {
    return d3
      .axisBottom(this.x)
      .tickFormat((d) => {
        return formatHoursMinutes(d)
      })
      .tickSizeOuter(0)
  }
  date() {
    const [start, end] = d3.extent(this.data.map((d) => d.time))

    if (!start || !end) return 'no data within range'

    return `${parseDate(start)} - ${parseDate(end)}`
  }
}

import * as d3 from 'd3'
import { formatHoursMinutes } from '../datetime'

// const zoomKey = 'altKey'

const marginLeft = 30
const marginRight = 0
const marginBottom = 50
const marginTop = 5

export default class {
  domains = []
  constructor({ keys, data, colors }) {
    this.data = data
    this.keys = keys
    this.colors = colors
    this.translate = (height = 0) =>
      `translate(${marginLeft} ${marginTop + height})`
    // this.xDomain = d3.extent(data.humidity.map((d) => d.time))
    this.xDomain = d3.extent(data.map((d) => d.time))
    this.previousDomain = this.xDomain
    this.currentDomain = this.xDomain
  }
  mount(root = this.rootNode) {
    this.rootNode = root
    this.root = d3.select(root)

    const { width, height } = this.rootNode.getBoundingClientRect()
    this.rootWidth = width
    this.width = width - (marginLeft + marginRight)
    this.height = height - (marginBottom + marginTop)

    this.xRange = [0, this.width]

    this.x = d3.scaleLinear().domain(this.xDomain).range(this.xRange)

    this.y = d3.scaleLinear().range([this.height, 0]).domain([-1, 75])

    this.brush = d3
      .brushX()
      .extent([
        [0, 0],
        [this.width, this.height],
      ])
      // .filter(() => !d3.event[zoomKey])
      .on('end', () => {
        const { selection } = d3.event
        try {
          this.brushedDomain = [
            this.x.invert(selection[0]),
            this.x.invert(selection[1]),
          ]
        } catch (error) {
          /* suppress weird error if nothing is selected */
        }
      })

    this.zoom = d3
      .zoom()
      .extent([
        [0, 0],
        [this.width, this.height],
      ])
      .scaleExtent([1, 50])
      .translateExtent([
        [0, 0],
        [this.width, this.height],
      ])
      .on('zoom', () => {
        const { transform } = d3.event
        this.rescaleX(transform.rescaleX(this.x))
      })

    this.render()
  }
  clean() {
    this.root.selectAll('*').remove()
  }
  render() {
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

    this.chart = this.root
      .append('g')
      .attr('transform', this.translate())
      .attr('clip-path', 'url(#clip)')

    // this.lines = this.entries.map(([key, data]) => {
    //   const line = d3
    //     .line(data)
    //     .x((d) => this.x(d.time))
    //     .y((d) => this.y(d[key]))

    //   const path = this.chart
    //     .append('path')
    //     .classed('line', true)
    //     .datum(data)
    //     .attr('fill', 'none')
    //     .attr('stroke', this.colors[key])
    //     .attr('stroke-width', 1)
    //     .attr('d', line)

    //   return [line, path]
    // })

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
        .attr('stroke', this.colors[key])
        .attr('stroke-width', 1)
        .attr('d', line)

      return [line, path]
    })

    this.xAxis = this.root
      .append('g')
      .classed('axis', true)
      .attr('transform', this.translate(this.height))
      .call(this.timeAxis())

    this.root
      .append('g')
      .classed('axis', true)
      .attr('transform', this.translate())
      .call(d3.axisLeft(this.y).tickSizeOuter(0))

    this.root
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('x', this.rootWidth / 2)
      .attr('y', this.height + marginBottom - 5)
      .text('Time (hours:minutes)')

    this.tool = this.root.append('g')
  }
  setTool(tool) {
    this.tool.selectAll('*').remove()
    if (tool === 'brush') {
      this.tool
        .append('g')
        .classed('brush', true)
        .attr('transform', this.translate())
        .call(this.brush)
    } else if (tool === 'zoom') {
      this.tool
        .append('rect')
        .classed('zoom', true)
        .attr('width', this.width)
        .attr('height', this.height)
        .attr('transform', this.translate())
        .attr('fill', 'none')
        .style('pointer-events', 'all')
        .call(this.zoom)
    }
  }
  applyBrush() {
    if (!this.brushedDomain) return
    this.pushDomain(this.brushedDomain)
    this.setX(this.brushedDomain)
    this.brushedDomain = null
    try {
      this.tool.select('.brush').call(this.brush.clear)
    } catch (error) {
      /* suppress weird error if nothing is selected */
    }
  }
  reset() {
    this.pushDomain()
    this.setX()
  }
  pushDomain(domain = this.xDomain) {
    this.domains.push(this.previousDomain)
    this.previousDomain = domain
  }

  getDomain() {
    return this.currentDomain
  }

  undo() {
    if (!this.domains.length) return

    const domain = this.domains.pop()
    this.previousDomain = domain
    this.setX(domain)
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
}

import * as c from '../../../style/colors'

export const units = {
  humidity: '%',
  temperature: '°C',
  sensors: '°C',
  pressure: 'psi x 100',
  deflection: 'mm',
  count: 'cars',
  fills: 'tank',
  x: 'g',
  y: 'g',
  z: 'g',
  magnitude: 'g',
}

export const colors = {
  humidity: c.blue,
  temperature: c.red,
  pressure: c.green,
  deflection: c.jade,
  sensors: c.green,
  count: c.orange,
  fills: c.orange,
  x: c.blue,
  y: c.red,
  z: c.yellow,
  magnitude: c.green,
}

for (let index = 1; index < 9; index++) {
  colors[`sensor${index}`] = colors.sensors
}

console.log(colors)

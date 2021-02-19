import * as c from '../../../style/colors'

const sensors = {}

for (let index = 1; index <= 8; index++) {
  sensors[`T${index}`] = '°C'
}

export const units = {
  humidity: '%',
  temperature: '°C',
  ...sensors,
  pressure: 'psi x 100',
  deflection: 'mm',
  count: 'cars',
  fills: 'tank',
  x: 'g',
  y: 'g',
  z: 'g',
  magnitude: 'g',
}

const makeColor = (value, saturation = 100, lightness = 75) =>
  `hsl(${value}, ${saturation}%, ${lightness}%)`

export const colors = {
  temperature: makeColor(350, 100, 50),
  humidity: makeColor(115, 80, 40),
  pressure: c.green,
  deflection: c.jade,
  count: c.orange,
  fills: c.orange,
  x: c.blue,
  y: c.red,
  z: c.yellow,
  magnitude: c.green,
  T1: makeColor(0),
  T2: makeColor(45),
  T3: makeColor(90),
  T4: makeColor(135),
  T5: makeColor(180),
  T6: makeColor(225),
  T7: makeColor(270),
  T8: makeColor(315),
}

for (let index = 1; index < 9; index++) {
  colors[`sensor${index}`] = colors.sensors
}

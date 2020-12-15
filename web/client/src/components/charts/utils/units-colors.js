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

export const colors = {
  humidity: c.blue,
  temperature: c.red,
  pressure: c.green,
  deflection: c.jade,
  count: c.orange,
  fills: c.orange,
  x: c.blue,
  y: c.red,
  z: c.yellow,
  magnitude: c.green,
  T1: 'tomato',
  T2: 'orange',
  T3: 'yellow',
  T4: 'green',
  T5: 'blue',
  T6: 'cyan',
  T7: 'mediumpurple',
  T8: 'magenta',
}

for (let index = 1; index < 9; index++) {
  colors[`sensor${index}`] = colors.sensors
}

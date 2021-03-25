import * as c from '../../style/colors'

const accessors = {
  count: ({ count }) => count,
  fills: ({ fills }) => fills,

  x: ({ x }) => x,
  y: ({ y }) => y,
  z: ({ z }) => z,
  magnitude: ({ magnitude }) => magnitude,

  pressure: ({ pressure }) => pressure,
  humidity: ({ humidity }) => humidity,
  temperature: ({ temperature }) => temperature,
  T1: ({ sensors }) => sensors[0],
  T2: ({ sensors }) => sensors[1],
  T3: ({ sensors }) => sensors[2],
  T4: ({ sensors }) => sensors[3],
  T5: ({ sensors }) => sensors[4],
  T6: ({ sensors }) => sensors[5],
  T7: ({ sensors }) => sensors[6],
  T8: ({ sensors }) => sensors[7],

  time: ({ time }) => time,
}

const hslColor = (value, saturation = 100, lightness = 75) =>
  `hsl(${value}, ${saturation}%, ${lightness}%)`

const strokes = {
  count: c.orange,
  fills: c.orange,
  x: c.blue,
  y: c.red,
  z: c.yellow,
  magnitude: c.green,

  deflection: c.jade,

  pressure: c.green,
  humidity: hslColor(115, 80, 40),
  temperature: hslColor(350, 100, 50),
  T1: hslColor(0),
  T2: hslColor(45),
  T3: hslColor(90),
  T4: hslColor(135),
  T5: hslColor(180),
  T6: hslColor(225),
  T7: hslColor(270),
  T8: hslColor(315),
}

const axes = {
  // count: c.orange,
  // fills: c.orange,
  x: 'left',
  y: 'left',
  z: 'left',
  magnitude: 'left',

  deflection: 'left',

  pressure: 'left',
  humidity: 'left',
  temperature: 'right',
  T1: 'right',
  T2: 'right',
  T3: 'right',
  T4: 'right',
  T5: 'right',
  T6: 'right',
  T7: 'right',
  T8: 'right',
}

const createExport = (keys) => {
  const settings = []
  for (const key of keys) {
    settings.push({
      key,
      accessor: accessors[key],
      stroke: strokes[key],
      axis: axes[key],
    })
  }
  return settings
}

// const environmentTankKeys = ['humidity', 'pressure', 'temperature']
const environmentBridgeKeys = [
  'humidity',
  'temperature',
  'T1',
  'T2',
  'T3',
  'T4',
  'T5',
  'T6',
  'T7',
  'T8',
]

const environmentKeys = environmentBridgeKeys
const deflectionKeys = ['deflection']
const accelerationKeys = ['x', 'y', 'z', 'magnitude']

export const environment = createExport(environmentKeys)
export const deflection = createExport(deflectionKeys)
export const acceleration = createExport(accelerationKeys)

// const keys = Object.entries({
//   environmentKeys,
//   deflectionKeys,
//   accelerationKeys,
// })

// const objects = {}
// for (const [label, key] of keys) {
//   objects[label] = {
//     accessor: accessors[key],
//     stroke: strokes[key],
//     axis: axes[key],
//   }
// }

// export const {
//   environmentKeys: environment,
//   deflectionKeys: deflection,
//   accelerationKeys: acceleration,
// }

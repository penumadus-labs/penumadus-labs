const queries = [
  {
    label: 'acceleration',
    field: 'accelerationData',
    projection: {
      _id: 0,
      'accelerationData.x': 1,
      'accelerationData.y': 1,
      'accelerationData.z': 1,
      'accelerationData.magnitude': 1,
      'accelerationData.time': 1,
    },
  },
  {
    label: 'standard',
    field: 'standardData',
    projection: {
      _id: 0,
      'standardData.temperature': 1,
      'standardData.humidity': 1,
      'standardData.pressure': 1,
      'standardData.time': 1,
    },
  },
  // {
  //   label: 'pressure',
  //   field: 'standardData',
  //   projection: {
  //     _id: 0,
  //     'standardData.pressure': 1,
  //     'standardData.time': 1,
  //   },
  // },
  // {
  //   label: 'temperatureAndHumidity',
  //   field: 'standardData',
  //   projection: {
  //     _id: 0,
  //     'standardData.temperature': 1,
  //     'standardData.humidity': 1,
  //     'standardData.time': 1,
  //   },
  // },
]

module.exports = queries

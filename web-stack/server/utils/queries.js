const groupedQueries = [
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
]

const queries = [
  {
    label: 'humidity',
    field: 'standardData',
    projection: {
      _id: 0,
      'standardData.humidity': 1,
      'standardData.time': 1,
    },
  },
  {
    label: 'pressure',
    field: 'standardData',
    projection: {
      _id: 0,
      'standardData.pressure': 1,
      'standardData.time': 1,
    },
  },
  {
    label: 'temperature',
    field: 'standardData',
    projection: {
      _id: 0,
      'standardData.temperature': 1,
      'standardData.time': 1,
    },
  },

  {
    label: 'x',
    field: 'accelerationData',
    projection: {
      _id: 0,
      'accelerationData.x': 1,
      'accelerationData.time': 1,
    },
  },
  {
    label: 'y',
    field: 'accelerationData',
    projection: {
      _id: 0,
      'accelerationData.y': 1,
      'accelerationData.time': 1,
    },
  },
  {
    label: 'z',
    field: 'accelerationData',
    projection: {
      _id: 0,
      'accelerationData.z': 1,
      'accelerationData.time': 1,
    },
  },
  {
    label: 'magnitude',
    field: 'accelerationData',
    projection: {
      _id: 0,
      'accelerationData.magnitude': 1,
      'accelerationData.time': 1,
    },
  },
]

module.exports = queries

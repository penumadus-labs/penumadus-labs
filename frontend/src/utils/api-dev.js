import axios from 'axios'

const settings = [
  { name: 'value1', value: 10, unit: 'a' },
  { name: 'value2', value: 20, unit: 'b' },
  { name: 'value3', value: 30, unit: 'c' },
  { name: 'value4', value: 40, unit: 'd' },
  { name: 'value5', value: 50, unit: 'e' },
  { name: 'value6', value: 60, unit: 'f' },
  { name: 'value7', value: 70, unit: 'g' },
  { name: 'value8', value: 80, unit: 'h' },
]

export const getDevices = async () => ['device1', 'device2', 'device3']

export const getSettings = async () => [settings, settings, settings]

export const device1 = async () => {
  const { data } = await axios.get('/device1.csv')
  return data
}

export const device2 = async () => {
  const { data } = await axios.get('/device2.csv')
  return data
}

export const device3 = async () => {
  const { data } = await axios.get('/device3.csv')
  return data
}

export const getData = async () =>
  Promise.all([device1(), device2(), device2()])

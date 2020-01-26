import axios from 'axios'

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

export const getAll = async () => Promise.all([device1(), device2(), device2()])

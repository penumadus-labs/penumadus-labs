import axios from 'axios'
import url from './url'

const api = axios.create({
  headers: {
    // 'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json; text/plain',
  },
  baseURL: url + 'api/',
})

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

export const getDevices = async () => ['device1']

export const getSettings = async () => [settings]

// used as array because context api expects multiple devices
export const getData = async () => {
  try {
    const responses = await Promise.all([api.get('tank')])
    return responses.map(({ data }) => data)
  } catch (e) {
    throw new Error('could not get tank data')
  }
}

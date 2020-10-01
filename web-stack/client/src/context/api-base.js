import axios from 'axios'

const baseURL = `${window.location.protocol}//${window.location.hostname}:8080/api/`
const withCredentials = process.env.NODE_ENV === 'development'

export const api = axios.create({
  baseURL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json; text/plain',
  },
  withCredentials,
})

export const getRequest = async (url, params) => {
  const { data } = await api.get(url, { params })
  return data
}

export const parseError = (error) =>
  error.response?.statusText || error.toString()

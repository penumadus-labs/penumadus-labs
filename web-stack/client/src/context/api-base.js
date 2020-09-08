import axios from 'axios'

// const baseURL = `${window.location.protocol}//${window.location.hostname}:8080/api/`

export const api = axios.create({
  baseURL: '/api/',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json; text/plain',
  },
})

// export const setToken = (token) => {
//   api.defaults.headers.token = token
// }

export const getRequest = async (url, params) => {
  const { data } = await api.get(url, { params })
  return data
}

export const parseError = (error) =>
  error.response?.statusText || error.toString()

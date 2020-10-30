import axios from 'axios'

const baseURL = `${window.location.protocol}//${window.location.hostname}:8080/api/`
const withCredentials = process.env.NODE_ENV === 'development'

const headers = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json',
  Accept: 'application/json; text/plain',
}

export const api = axios.create({
  baseURL,
  headers,
  withCredentials,
})

export const parseError = (error) =>
  error.response?.statusText || error.toString()

export const request = async (url, params = {}, method = 'get') => {
  const { data } = await api({ method, url, params })
  return data
}

export const update = async (url, data = {}, method = 'post') => {
  const res = await api({ method, url, data })
  return res.data
}

// export const update = async (url, data = {}) => {
//   const res = await fetch(baseURL + url, {
//     mode: 'cors',
//     method: 'POST',
//     credentials: 'include',
//     headers,
//     body: JSON.stringify(data),
//   })
//   if (!res.ok) throw new Error('oops')
// }

// export const request = async (url, data = {}) => {
//   const res = await fetch(baseURL + url, {
//     mode: 'cors',
//     method: 'GET',
//     credentials: 'include',
//     headers,
//     body: JSON.stringify(data),
//   })
//   if (!res.ok) throw new Error('oops')
//   return res.json()
// }

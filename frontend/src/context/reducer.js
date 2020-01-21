function reducer(state, action) {
  let { count } = state

  switch (action.type) {
    case '':
      count++
      return { ...state, count }
    case 'dec':
      count--
      return { ...state, count }
    default:
      return { ...state, error: new Error() }
  }
}
import axios from 'axios'
import { csv } from '../utils/api'

export default async (state, device) => {
  switch (device) {
    case 'device1':
      return await axios.get(csv)
  }
}

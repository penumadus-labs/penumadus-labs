import { useState, useEffect } from 'react'
import axios from 'axios'

export default url => {
  const [data, setData] = useState(null)

  useEffect(() => {
    void (async function() {
      const { data } = await axios.get(url)
      setData(data)
    })().catch(console.error)
  }, [url])

  return data
}

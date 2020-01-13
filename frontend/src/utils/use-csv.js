import useApi from './use-api'
import parse from 'csv-parse/lib/sync'

function parseCsv(data) {
  return parse(data, {
    columns: true,
    skip_empty_lines: true,
  })
}

const useCsv = url => {
  const data = useApi(url)

  return data && parseCsv(data)
}

export default useCsv

export function filter(data, ...keys) {
  console.log(keys)
  return data.map(obj => {
    const filtered = {}
    for (const key of keys) {
      filtered[key] = obj[key]
    }
    return filtered
  })
}

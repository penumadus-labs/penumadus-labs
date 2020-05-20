import parse from 'csv-parse/lib/sync'

export const parseCSVData = (data) =>
  parse(data, {
    columns: true,
    skip_empty_lines: true,
  })

export const filterData = (data, ...keys) =>
  data.map((obj) => {
    const filtered = {}
    for (const key of keys) {
      filtered[key] = obj[key]
    }
    return filtered
  })

const fileMeta = 'data:text/csv;charset=utf-8,'

export const makeCSVFile = (data) => fileMeta + encodeURIComponent(data)

import parse from 'csv-parse/lib/sync'

export const parseCSVData = (data) =>
  parse(data, {
    columns: true,
    skip_empty_lines: true,
  })

export const makeCSVFile = (data) =>
  'data:text/csv;charset=utf-8,' + encodeURIComponent(data)

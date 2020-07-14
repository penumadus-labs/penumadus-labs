export const parseDate = (date) =>
  new Date(date * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

const parseTime = (time) => {
  return `${formatHoursMinutes(time)}, ` + parseDate(time)
}

export const parseDomain = ([start, end]) => {
  return `${parseTime(start)} - ${parseTime(end)}`
}

export const formatHoursMinutes = (time) => {
  const date = new Date(time * 1000)
  const minutes = date.getMinutes()
  return `${date.getHours()}:${minutes < 10 ? '0' + minutes : minutes}`
}

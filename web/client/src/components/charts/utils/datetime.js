export const parseDate = (date) =>
  new Date(date * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

export const oneDay = 86400000
export const threeDays = oneDay * 3

const parseTime = (time) => {
  return `${formatHoursMinutes(time)}, ` + parseDate(time)
}

export const formatDomain = ([start, end]) => {
  // if (end - start <= oneDay)
  return `${parseTime(start)} - ${parseTime(end)}`
}

export const formatHoursMinutes = (time) => {
  const date = new Date(time * 1000)
  const minutes = date.getMinutes()
  return `${date.getHours()}:${minutes < 10 ? '0' + minutes : minutes}`
}

export const formatMonthDayHoursMinutes = (time) => {
  const date = new Date(time * 1000)
  const month = date.getMonth()
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()

  return `${month}/${day} ${hours}:${minutes < 10 ? '0' + minutes : minutes}`
}

export const oneDayAgo = () => {
  return Math.floor((new Date(Date.now()) - 86_400_000) / 1000)
}

export const oneHourAgo = () => {
  return (Date.now() - 600_000) / 1000
}

export const now = () => Date.now() / 1000

export const oneHourInSeconds = 3600

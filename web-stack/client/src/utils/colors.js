const dark = true

export const gray = '#ccc'
export const white = '#f5f5f5'
// reds
export const raspberry = '#d21f3c'
export const firebrick = '#b22222'
export const red = '#da2c43'

export const green = '#1cac78'
export const jade = '#00a86b'

export const blue = '#6cbfee'
export const steel = '#4682b4'
export const space = '#1d2951'

export const purple = '#645394'

export const yellow = '#BFA33F'

const opacity = '.95'

const darkBody = `rgb(50, 59, 68, 1)`
const darkCard = `rgb(33, 42, 51, ${opacity})`
const darkButton = `rgb(140, 153, 162, ${opacity})`
const darkFont = `rgb(204, 204, 204, ${opacity})`

const lightBody = '#1e1e1e'
const lightCard = '#272727'
const lightButton = '#909090'

export const body = dark ? darkBody : lightBody
export const card = dark ? darkCard : lightCard
export const button = dark ? darkButton : lightButton
export const font = darkFont

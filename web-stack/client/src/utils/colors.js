const dark = true

// 0 3 6 9 c f

// reds
export const raspberry = '#d21f3c'
export const firebrick = '#b22222'
export const red = '#da2c43'

export const orange = '#ED6911'

export const yellow = '#BFA33F'

export const green = '#1cac78'
export const jade = '#00a86b'

export const blue = '#6cbfee'
export const blue2 = 'rgb(0, 90, 125)'
export const steel = '#4682b4'
export const space = '#1d2951'

export const purple = '#645394'
export const plumb = 'rgb(128, 0, 90)'
export const purpleRed = 'rgb(175, 90, 125)'
export const redPurple = 'rgb(195, 0, 64)'

export const gray1 = '#333'
export const gray2 = '#666'
export const gray3 = '#999'
export const gray4 = '#ccc'

export const white = '#f5f5f5'

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

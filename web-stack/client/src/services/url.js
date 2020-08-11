const base = `//${window.location.hostname}:8080/`

export const wsURL = 'ws:' + base

export const url = window.location.protocol + base

export const apiUrl = url + 'api/'

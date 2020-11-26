const events = (module.exports = {
  configurable: true,
  streams: [
    { name: 'environmental', command: 'environmental' },
    { name: 'deflection', command: 'deflection' },
    { name: 'acceleration', command: 'acceleration' },
  ],
})

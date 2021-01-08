const { connect } = require('net')

const wait = (time = 500) => new Promise((res) => setTimeout(res, time))

exports.connectToServer = async (
  createPacket,
  { timeBetween = 1000, limit = Infinity } = {}
) => {
  while (true)
    try {
      const conn = await Deno.connect({ port: 32100 })
      console.log('connected')

      const write = async (packet) => {
        await conn.write(packet)
        await wait(timeBetween)
        console.log('write')
      }
      await wait(2000)
      for (let index = 0; index < limit; index++) await write(createPacket())

      await conn.close()

      return console.log('done')
    } catch (error) {
      console.error(error)
      console.error('disconnected')
      if (limit === Infinity) return
      await wait(2000)
    }
}

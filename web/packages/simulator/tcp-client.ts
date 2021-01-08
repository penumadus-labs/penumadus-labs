const wait = (time = 500) => new Promise((res) => setTimeout(res, time))

export const connectToServer = async (
  createPacket: () => Uint8Array,
  { timeBetween = 1000, limit = Infinity } = {}
) => {
  while (true)
    try {
      const conn = await Deno.connect({ port: 32100 })
      console.info('connected')

      const write = async (packet: Uint8Array) => {
        await conn.write(packet)
        await wait(timeBetween)
        console.info('write')
      }
      await wait(2000)
      for (let index = 0; index < limit; index++) await write(createPacket())

      await conn.close()

      return console.info('done')
    } catch (error) {
      console.error(error)
      console.error('disconnected')
      if (limit === Infinity) return
      await wait(2000)
    }
}

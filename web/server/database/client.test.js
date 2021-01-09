const db = require('./client')
const { deviceSchemas } = require('./schemas')

db.silent = true

const { createAccelerationEvent, createDocuments } = require('@web/test')

const id = 'test-device'
const deviceType = 'tank'
const { dataTypes } = deviceSchemas[deviceType]

const testCollections = async (contains) =>
  Promise.all(
    dataTypes.map(async (type) => {
      const collections = await db.db(type).collections()
      const list = collections.map(({ collectionName }) => collectionName)

      if (contains) expect(list).toContain(id)
      else expect(list).not.toContain(id)
    })
  )

const testDevice = async (exists) => {
  const device = await db.devices.findOne({ id })
  if (exists) expect(device).not.toBeNull()
  else expect(device).toBeNull()
}

const testData = ({ noDataCollected, data }, value, empty = false) => {
  const expectedEmpty = value === undefined || empty
  expect(Array.isArray(data)).toBe(true)
  expect(noDataCollected).toBe(expectedEmpty)
  expect(data.length).toBe(value ?? 0)
}

const testCounter = async (field, value = 0) => {
  const { counters } = await db.devices.findOne({ id })
  expect(counters[field]).toBe(value)
}

beforeAll(() => db.connect(process.env.MONGO_URL, true))

afterAll(() => db.close())

describe('test udp port functionality', () => {
  let initialValue
  it('should be a number', async () => {
    initialValue = await db.getUdpPortIndex()
    expect(Number.isInteger(initialValue)).toBe(true)
  })

  it('should increase by one', async () => {
    const udpPort = await db.getUdpPortIndex()
    expect(initialValue + 1).toEqual(udpPort)
  })

  it('should return to default index (30000)', async () => {
    await db.resetUdpPortIndex()
    const { udpPortIndex } = await db.appData.findOne()
    expect(udpPortIndex).toEqual(initialValue)
  })
  it('', async () => {
    await db.insertDevice({ id: 'test1', deviceType })
    await db.insertDevice({ id: 'test2', deviceType })
    await db.insertDevice({ id: 'test3', deviceType })

    const udpPorts = await db.getUdpPorts()
    expect(Array.isArray(udpPorts)).toBe(true)
    udpPorts.forEach((port, i) => {
      expect(port).toBe(initialValue + i)
    })
  })
})

describe('device inserts and removes', () => {
  afterEach(async () => {
    try {
      await db.removeDevice(id)
    } catch (err) {}
  })

  test('insert device', async () => {
    await testDevice(false)
    await testCollections(false)
    await db.insertDevice({ id, deviceType })
    await testDevice(true)
    await testCollections(true)
    await db.removeDevice(id)
    await testDevice(false)
    await testCollections(false)
  })

  test('test schema', async () => {
    expect(db.schemas[id]).toBeUndefined()
    await db.insertDevice({ id, deviceType })

    const schema = db.schemas[id]
    expect(db.schemas[id]).not.toBeUndefined()
    expect(schema.id).toBe(id)
    expect(schema.deviceType).toBe(deviceType)
    expect(schema.dataTypes).toEqual(dataTypes)
    expect(Number.isInteger(schema.udpPort)).toBe(true)
    expect(Object.keys(schema.counters)).toEqual(dataTypes)
    for (const value of Object.values(schema.counters)) expect(value).toBe(0)
  })

  test('duplicate insert', async () => {
    await db.insertDevice({ id: 'a', deviceType })
    await db.insertDevice({ id: 'b', deviceType })
    expect(async () => {
      await db.insertDevice({ id: 'c', deviceType })
      await db.insertDevice({ id: 'c', deviceType })
    }).rejects.toThrow()
  })
})

describe('insert and remove device and test its functionality', () => {
  beforeAll(() => db.insertDevice({ id, deviceType }))
  afterAll(() => db.removeDevice(id))
  describe('acceleration data tests', () => {
    const field = 'acceleration'

    test('initial state', async () => {
      await testCounter(field)
      const times = await db.getAcceleration({ id })
      expect(Array.isArray(times)).toBe(true)

      expect(times.length).toEqual(0)
      await testData(await db.getAccelerationEvent({ id }))
    })

    const events = [40, 60, 80]

    test('acceleration event', async () => {
      let i = 0
      for (const event of events) {
        await db.insertAccelerationEvent(id, createAccelerationEvent(event))
        i++
        await testCounter(field, i)
      }
      const times = await db.getAcceleration({ id })

      expect(times.length).toBe(events.length)

      testData(await db.getAccelerationEvent({ id }), events[2])
      await Promise.all(
        events.map(async (_, i) =>
          testData(
            await db.getAccelerationEvent({ id, time: times[i] }),
            events[events.length - 1 - i]
          )
        )
      )
    })

    test('data deletes and counter resets', async () => {
      await db.deleteData({ id, field })
      await testCounter(field)
    })

    test('no data collected true, data is an array and empty 2', async () => {
      testData(await db.getAccelerationEvent({ id }))
    })
  })

  describe('linear data', () => {
    const field = 'environment'
    test('device exists and counter is zero', async () => {
      await testDevice(true)
    })

    test('initial linear data state', async () => {
      testData(await db.getDataRange({ field, id }))
      testData(await db.getDataRecent({ field, id }))
      await testCounter(field)
    })

    const nPackets = 5000
    test('insert data', async () => {
      await testCounter(field)
      await Promise.all(
        createDocuments(nPackets).map((data) => db.insertData(field, id, data))
      )
      await testCounter(field, nPackets)
    })

    test('data recent', async () => {
      const limit = 2000
      testData(await db.getDataRecent({ field, id }), 1000)
      testData(await db.getDataRecent({ field, id, limit }), limit)
    })
    test('data range', async () => {
      // full data set
      testData(await db.getDataRange({ field, id }), nPackets)

      const buckets = 1000

      // full dataset, limited packets
      testData(await db.getDataRange({ limit: 1000, field, id }), 1000)

      // full dataset, limited packets
      testData(await db.getDataRange({ limit: 1500, field, id }), 1500)
      // slice of data, full range
      testData(
        await db.getDataRange({
          start: 100,
          end: 199,
          field,
          id,
        }),
        100
      )

      // slice of data with result larger than limit
      testData(
        await db.getDataRange({
          start: 100,
          end: 1299,
          limit: 1000,
          field,
          id,
        }),
        1000
      )

      // slice of data with result smaller than limit
      testData(
        await db.getDataRange({
          start: 100,
          end: 199,
          field,
          limit: buckets,
          id,
        }),
        100
      )

      testData(
        await db.getDataRange({
          start: 100_000,
          end: 200_000,
          field,
          id,
        }),
        0,
        false
      )

      testData(
        await db.getDataRange({
          start: 100_000,
          end: 200_000,
          field,
          limit: buckets,
          id,
        }),
        0,
        false
      )
    })

    test('delete data', async () => {
      await db.deleteData({ id, field })
      testData(await db.getDataRange({ field, id }))
      testData(await db.getDataRecent({ field, id }))
      await testCounter(field)
    })
  })
})

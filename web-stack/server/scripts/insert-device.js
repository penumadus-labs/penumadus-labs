const { wrap, insertDevice } = require('../controllers/database')

const device = {
  id: 'unit_3',
  standardData: [],
  accelerationData: [],
}

wrap(async () => {
  await insertDevice(device)
})

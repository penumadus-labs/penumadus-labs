// const environmentTankData = {
//   id: 'morganbridge',
//   type: 'environment',
//   pressure: 50,
//   fills: 20,
//   temperature: 25,
//   humidity: 40,
// }

const id = 'morganbridge'

const environmentBridgeData = {
  id,
  type: 'environment',
  humidity: 80,
  temperature: 20,
  sensors: [20, 20, 20, 20, 20, 20, 20, 20],
}

const createPacket = ({ type, ...data }) => {
  return {
    type,
    data: {
      ...data,
      time: Date.now() / 1000,
    },
  }
}

export const socketTasks = (tasks, time = 3000) => {
  setInterval(() => {
    const data = createPacket(environmentBridgeData)
    for (const task of tasks) {
      task(data)
    }
  }, time)
}

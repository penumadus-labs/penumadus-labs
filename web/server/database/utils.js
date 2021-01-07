const increment = async (col, query, field) => {
  const { value } = await col.findOneAndUpdate(query, { $inc: { [field]: 1 } })
  return value
}

const resolveData = async (collection, resolver) => {
  const noDataCollected = !(await collection.countDocuments())

  return {
    noDataCollected,
    data: noDataCollected ? [] : await resolver(),
  }
}

module.exports = {
  increment,
  resolveData,
}

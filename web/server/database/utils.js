const increment = async (col, query, field, amount = 1) => {
  const { value } = await col.findOneAndUpdate(query, {
    $inc: { [field]: amount },
  })
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

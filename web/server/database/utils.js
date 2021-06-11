const increment = async (col, query, field, amount = 1) => {
  const { value } = await col.findOneAndUpdate(query, {
    $inc: { [field]: amount },
  })
  return value
}

const resolveData = async (collection, data) => {
  const count = await collection.countDocuments()
  const noDataCollected = !count

  return {
    noDataCollected,
    data: noDataCollected || !data ? [] : data,
  }
}

module.exports = {
  increment,
  resolveData,
}

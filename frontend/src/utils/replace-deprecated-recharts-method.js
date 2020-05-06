function replaceMethods(...list) {
  for (const item of list) {
    item.prototype.componentDidUpdate = item.prototype.componentWillReceiveProps
    delete item.prototype.componentWillReceiveProps
  }
}

export default replaceMethods

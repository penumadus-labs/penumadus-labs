export const isChild = ({ childNodes }, node) => {
  for (const child of childNodes) {
    if (node === child) return true
    if (child.childNodes.length && isChild(child, node)) return true
  }

  return false
}

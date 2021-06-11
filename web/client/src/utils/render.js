export const handleRenderProp = (children, render, props) =>
  typeof render === 'function' ? render(props) : children

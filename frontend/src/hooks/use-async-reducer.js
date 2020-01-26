import { useReducer, useMemo } from 'react'

export default (reducer, initialState, createActions) => {
  const [state, disptach] = useReducer(reducer, initialState)

  const actions = useMemo(() => createActions(disptach), [
    disptach,
    createActions,
  ])

  return [state, actions]
}

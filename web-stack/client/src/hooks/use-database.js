import { useContext } from 'react'
import DatabaseContext from '../context/database/context'

export const useDatabaseState = () => useContext(DatabaseContext)[0]
export const useDatabaseActions = () => useContext(DatabaseContext)[1]

export default () => useContext(DatabaseContext)

import { useContext } from 'react'
import DatabaseContext from '../context/database/database'

export const useDatabaseContextState = () => useContext(DatabaseContext)[0]
export const useDatabaseContextActions = () => useContext(DatabaseContext)[1]

export default () => useContext(DatabaseContext)

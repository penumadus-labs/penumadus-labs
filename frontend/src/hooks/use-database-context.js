import { useContext } from 'react'
import DatabaseContext from '../context/database/database'

export const useDatabaseContextState = () => useContext(DatabaseContext)[0]

export default () => useContext(DatabaseContext)

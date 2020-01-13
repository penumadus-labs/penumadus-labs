import React, { createContext, useReducer } from 'react';
import reducer from './reducer';

const initialState = {
  count: 0,
  error: null,
};

const Context = createContext();

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
};

export default Store;
export { Context };

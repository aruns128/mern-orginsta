import React, { createContext, useReducer } from "react";
import { Reducers } from "./Reducers";

export const initialState = null;
export const Store = createContext(initialState);

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(Reducers, initialState);
  return (
    <Store.Provider value={{ state, dispatch }}>
      {props.children}
    </Store.Provider>
  );
}

import React, { createContext, useContext, useReducer } from "react";
import appReducer, { initialState } from "./reducer";

const ContextRRP = createContext();

export const ProviderRRP = (props) => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const providerValue = {state, dispatch};

    return <ContextRRP.Provider value={providerValue} {...props} />
};

export const useContextRRP = () => useContext(ContextRRP);
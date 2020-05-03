import { Pool } from 'kefir';
import { Action } from 'redux';
import { createContext, useContext } from 'react';

export const CentralObservableContext = createContext<Pool<
  Action,
  never
> | null>(null);

export const { Provider, Consumer } = CentralObservableContext;

export const useCentralObservable = () => useContext(CentralObservableContext);

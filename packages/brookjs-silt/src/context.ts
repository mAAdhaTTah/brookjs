import { Pool } from 'kefir';
import { Action } from 'redux';
import { createContext } from 'react';

export const CentralObservableContext = createContext<Pool<
  Action,
  never
> | null>(null);

export const { Provider, Consumer } = CentralObservableContext;

import { Pool } from 'kefir';
import { Action } from 'redux';
import { createContext } from 'react';

export const CentralObservableContext = createContext<Pool<
  Action,
  Error
> | null>(null);

export const { Provider, Consumer } = CentralObservableContext;

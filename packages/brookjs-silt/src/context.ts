import Kefir, { Pool } from 'kefir';
import { Action } from 'redux';
import { createContext } from 'react';

const { Provider, Consumer } = createContext<Pool<Action, Error>>(Kefir.pool());

export { Provider, Consumer };

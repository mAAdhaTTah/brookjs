import { Pool } from 'kefir';
import { Action } from 'redux';
import { createContext } from 'react';

export const SiltContext = createContext<Pool<Action, Error> | null>(null);

const { Provider, Consumer } = SiltContext;
export { Provider, Consumer };

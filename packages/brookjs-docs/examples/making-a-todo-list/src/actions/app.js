import { createAction } from 'redux-actions';

export const init = createAction('INIT');

export const incrementClick = createAction('INCREMENT_CLICK');

export const decrementClick = createAction('DECREMENT_CLICK');

export const click = createAction('CLICK');

export const change = createAction('CHANGE', value => ({ value }));

export const addTodo = createAction('ADD_TODO', name => ({ name }));

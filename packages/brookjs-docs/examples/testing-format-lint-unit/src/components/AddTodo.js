import React from 'react';
import { RootJunction, ofType, toJunction, useDelta } from 'brookjs';
import { handleActions } from 'redux-actions';
import { change, click, addTodo } from '../actions';
import Input from './Input';
import Button from './Button';

const defaultState = {
  value: ''
};

const reducer = handleActions(
  {
    [change]: (state, action) => ({
      ...state,
      value: action.payload.value
    }),
    [click]: state => ({
      ...state,
      // Clear value on submission
      value: ''
    })
  },
  defaultState
);

const AddTodo = () => {
  const { root$, state } = useDelta(reducer, defaultState);

  return (
    <RootJunction root$={root$}>
      <div className="add-todo">
        <Input label="Todo: " name="input" value={state.value} />
        <Button>Add Todo</Button>
      </div>
    </RootJunction>
  );
};

const events = {};

const combine = all$ => {
  const change$ = all$.thru(ofType(change));
  const click$ = all$.thru(ofType(click));

  return change$
    .filter(action => action.payload.value !== '')
    .sampledBy(click$)
    .skipDuplicates()
    .map(action => addTodo(action.payload.value));
};

export default toJunction(events, combine)(AddTodo);

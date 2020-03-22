import React from 'react';
import { RootJunction, ofType, useDelta, toJunction } from 'brookjs';
import { handleActions } from 'redux-actions';
import { change, click, submit } from '../actions';
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

const Submit = () => {
  const { root$, state } = useDelta(reducer, defaultState);

  return (
    <RootJunction root$={root$}>
      <Input label="Input: " name="input" value={state.value} />
      <Button>Submit</Button>
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
    .map(action => submit(action.payload.value));
};

export default toJunction(events, combine)(Submit);

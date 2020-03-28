import React from 'react';
import { toJunction } from 'brookjs';
import { click } from '../actions';

const Button = ({ children, onClick }) => {
  return (
    <button className="btn" onClick={onClick}>
      {children}
    </button>
  );
};

const events = {
  onClick: e$ => e$.map(() => click())
};

export default toJunction(events)(Button);

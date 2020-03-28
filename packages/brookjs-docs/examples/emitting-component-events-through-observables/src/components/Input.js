import React from 'react';
import { toJunction } from 'brookjs';
import { change } from '../actions';

const Input = ({ label, name, value, onChange }) => {
  return (
    <label htmlFor={name} className="input">
      {label}
      <input id={name} name={name} value={value} onChange={onChange} />
    </label>
  );
};

const events = {
  onChange: e$ => e$.map(e => change(e.target.value))
};

export default toJunction(events)(Input);

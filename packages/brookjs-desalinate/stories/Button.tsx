import React from 'react';
import { toJunction } from 'brookjs-silt';

const Button = ({ onClick }) => <button onClick={onClick}>Click me!</button>;

export default toJunction({
  onClick: e$ => e$.map(() => ({ type: 'CLICK' }))
})(Button);

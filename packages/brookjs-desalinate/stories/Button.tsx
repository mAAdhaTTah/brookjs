import React from 'react';
import { toJunction } from 'brookjs-silt';
import { Observable } from 'kefir';

type Props = { onClick: any };

const Button: React.FC<Props> = ({ onClick }) => (
  <button onClick={onClick}>Click me!</button>
);

const events = {
  onClick: (e$: Observable<any, never>) => e$.map(() => ({ type: 'CLICK' }))
};

export default toJunction(events)(Button);

import React from 'react';
import { toJunction } from 'brookjs-silt';
import { Observable } from 'kefir';

type Props = { onClick: any };

const Button: React.FC<Props> = ({ onClick }) => (
  <button onClick={onClick}>Click me!</button>
);

const events = {
  onClick: (e$: Observable<any, any>) => e$.map(() => ({ type: 'CLICK' }))
};

export default toJunction<Props, typeof events>(events)(Button);

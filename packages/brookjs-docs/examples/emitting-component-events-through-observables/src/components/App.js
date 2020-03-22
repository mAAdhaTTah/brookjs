import React from 'react';
import { toJunction } from 'brookjs-silt';
import Submit from './Submit';

const App = () => {
  return (
    <div className="03-emitting-component-events-through-observables">
      <Submit />
    </div>
  );
};

const events = {};

export default toJunction(events)(App);

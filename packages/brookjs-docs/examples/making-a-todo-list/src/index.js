import React from 'react';
import { createStore } from 'brookjs';
import { RootJunction } from 'brookjs-silt';
import ReactDOM from 'react-dom';
import { init } from './actions';
import { App } from './components';
import { rootDelta } from './deltas';
import { reducer, mapStateToProps } from './state';

let store;
let root$;
let unsub;

const render = () => {
  ReactDOM.render(
    <RootJunction root$={root$}>
      <App {...mapStateToProps(store.getState())} />
    </RootJunction>,
    document.getElementById('root')
  );
};

const bootstrap = initialState => {
  unsub && unsub();
  store = createStore(reducer, initialState, rootDelta);
  root$ = root$ => root$.observe(store.dispatch);
  unsub = store.subscribe(render);
};

bootstrap();
store.dispatch(init());

if (module.hot) {
  // Nothing needs to be done when the actions change.
  module.hot.accept('./actions');

  // Rerender if the  components change.
  module.hot.accept('./components', render);

  // Update the store
  module.hot.accept(['./deltas', './state'], () => bootstrap(store.getState()));
}

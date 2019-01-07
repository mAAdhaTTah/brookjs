import Kefir, { Property } from 'kefir';
import { Store } from 'redux';

export default <S>(store: Store<S>): Property<S, never> =>
  Kefir.fromESObservable<S, never>(store)
    .toProperty(store.getState)
    .setName('fromReduxStore');

import Kefir from '../kefir';

export default store =>
    Kefir.fromESObservable(store)
        .toProperty(store.getState)
        .setName('fromReduxObservable');

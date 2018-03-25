// @flow
import createReactContext, { type Context } from 'create-react-context';
import Kefir, { type Observable } from 'kefir';

const { Provider, Consumer }: Context<Observable<*>> = createReactContext(Kefir.never());

export { Provider, Consumer };

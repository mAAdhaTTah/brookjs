import createReactContext from 'create-react-context';
import Kefir from 'kefir';

const { Provider, Consumer } = createReactContext(Kefir.pool());

export { Provider, Consumer };

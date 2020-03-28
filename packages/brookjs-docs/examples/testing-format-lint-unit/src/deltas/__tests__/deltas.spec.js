import { ajax$, ObsResponse, NetworkError } from 'kefir-ajax';
import Kefir from 'kefir';
import { saveTodoRequest, saveTodoSucceeded, saveTodoFailed } from '../../actions';
import { rootDelta } from '../';

jest.mock('kefir-ajax', () => ({
  NetworkError: jest.requireActual('kefir-ajax').NetworkError,
  ObsResponse: class ObsResponse {
    constructor(body) {
      this.body = body
    }

    json() {
      return jest.requireActual('kefir').constant(JSON.parse(this.body));
    }
  },
  ajax$: jest.fn()
}));

describe('rootDelta', () => {
  const todo = { name: 'New Todo', completed: false };

  it('should emit success when making a successful API request', () => {
    ajax$.mockReturnValue(Kefir.constant(new ObsResponse(JSON.stringify(todo))));

    expect(rootDelta).toEmitFromDelta(
      [[0, KTU.value(saveTodoSucceeded(todo))]],
      send => {
        send(saveTodoRequest(todo), { todos: [todo] });
      }
    );
  });

  it('should emit error when making a failed API request', () => {
    const error = new NetworkError('error');
    ajax$.mockReturnValue(Kefir.constantError(error));
    
    expect(rootDelta).toEmitFromDelta(
      [[0, KTU.value(saveTodoFailed(error))]],
      send => {
        send(saveTodoRequest(todo), { todos: [todo] });
      }
    );
  });
});

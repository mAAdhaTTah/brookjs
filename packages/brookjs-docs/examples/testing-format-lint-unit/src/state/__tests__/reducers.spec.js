import { loop } from 'brookjs';
import { addTodo, saveTodoRequest } from '../../actions';
import { todosReducer } from '../reducers';

describe('reducers', () => {
  describe('todosReducer', () => {
    it('should handle ADD_TODO', () => {
      expect(todosReducer([], addTodo('New todo'))).toEqual(
        loop(
          [{ name: 'New todo', completed: false }],
          saveTodoRequest({
            name: 'New todo',
            completed: false
          })
        )
      );
    });
  });
});

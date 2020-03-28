import { handleActions } from 'redux-actions';
import { loop, combineReducers } from 'brookjs';
import { addTodo, saveTodoRequest } from '../actions';

export const todosReducer = handleActions(
  {
    [addTodo]: (state, action) => {
      const todo = {
        name: action.payload.name,
        completed: false
      };
      return loop([...state, todo], saveTodoRequest(todo));
    }
  },
  []
);

export const reducer = combineReducers({
  todos: todosReducer
});

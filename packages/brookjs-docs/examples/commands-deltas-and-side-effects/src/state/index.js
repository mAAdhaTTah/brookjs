import { handleActions } from 'redux-actions';
import { combineReducers, loop } from 'brookjs';
import { addTodo, saveTodoRequest } from '../actions';

const todosReducer = handleActions(
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

export const mapStateToProps = state => ({
  todos: state.todos
});

import { handleActions } from "redux-actions";
import { combineReducers } from "brookjs";
import { addTodo } from "../actions";

const todosReducer = handleActions(
  {
    [addTodo]: (state, action) => [
      ...state,
      { name: action.payload.name, completed: false }
    ]
  },
  []
);

export const reducer = combineReducers({
  todos: todosReducer
});

export const mapStateToProps = state => ({
  todos: state.todos
});

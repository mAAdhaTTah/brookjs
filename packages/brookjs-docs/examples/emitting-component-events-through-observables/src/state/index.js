import { handleActions } from 'redux-actions';
import { incrementClick, decrementClick } from '../actions';

const initialState = {
  count: 0
};

export const reducer = handleActions(
  {
    [incrementClick]: state => ({ ...state, count: state.count + 1 }),
    [decrementClick]: state => ({ ...state, count: state.count - 1 })
  },
  initialState
);

export const mapStateToProps = state => ({
  count: state.count
});

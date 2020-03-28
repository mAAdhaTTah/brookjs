import { reducer, mapStateToProps } from '../index';
import { init, incrementClick, decrementClick } from '../../actions';

describe('state', () => {
  describe('reducer', () => {
    it('should return the initial state on init action', () => {
      expect(reducer({ count: 0 }, init())).toEqual({ count: 0 });
    });

    it('should increase the count on increment click', () => {
      expect(reducer({ count: 0 }, incrementClick())).toEqual({ count: 1 });
    });

    it('should increase the count on decrement click', () => {
      expect(reducer({ count: 0 }, decrementClick())).toEqual({ count: -1 });
    });
  });

  describe('mapStateToProps', () => {
    it('should select the count', () => {
      expect(mapStateToProps({ count: 20 })).toEqual({ count: 20 });
    });
  });
});

import React from 'react';
import { fireEvent } from '@testing-library/react';
import { incrementClick, decrementClick } from '../../actions';
import App from '../App';

describe('App', () => {
  it('should emit actions', () => {
    expect(<App count={3} />).toEmitFromJunction(
      [
        [0, KTU.value(incrementClick())],
        [0, KTU.value(decrementClick())]
      ],
      api => {
        fireEvent.click(api.getByText('+'));
        fireEvent.click(api.getByText('-'));
      }
    );
  });
});

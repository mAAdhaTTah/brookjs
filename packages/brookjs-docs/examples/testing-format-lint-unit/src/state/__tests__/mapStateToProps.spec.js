import { mapStateToProps } from '../mapStateToProps';

describe('mapStateToProps', () => {
  it('should select the component props', () => {
    expect(
      mapStateToProps({ todos: [{ name: 'First', completed: true }] })
    ).toEqual({ todos: [{ name: 'First', completed: true }] });
  });
});

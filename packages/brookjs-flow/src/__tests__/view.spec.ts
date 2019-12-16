/* eslint-env jest */
import view from '../view';

const { stream, prop, value, send, error, end } = KTU;

describe('view', () => {
  it('should be a function', () => {
    expect(view).toBeInstanceOf(Function);
  });

  it('should take a callback and return a function', () => {
    expect(view(x => x)).toBeInstanceOf(Function);
  });

  it('should be able to be passed to Observable#thru', () => {
    expect(stream().thru(view(x => x))).toBeStream();
    expect(prop().thru(view(x => x))).toBeProperty();
  });

  it('should emit result from function callback', () => {
    const a = stream();

    expect(a.thru(view(x => !x))).toEmit([value(true)], () => {
      send(a, [value(false)]);
    });
  });

  it('should not emit result when equals previous', () => {
    const a = stream();

    expect(a.thru(view(x => !x))).toEmit([value(true)], () => {
      send(a, [value(false), value(false)]);
    });
  });

  it('should emit errors and end', () => {
    const a = stream();

    expect(a.thru(view(x => !x))).toEmit([error(true), end()], () => {
      send(a, [error(true), end()]);
    });
  });

  it('should emit undefined on the first element', () => {
    const a = stream();

    expect(a.thru(view(x => x))).toEmit([value(undefined), end()], () => {
      send(a, [value(undefined), end()]);
    });
  });
});

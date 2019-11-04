/* eslint-env jest */
import { expect, use } from 'chai';
import Kefir from 'kefir';
import { chaiPlugin } from 'brookjs-desalinate';
import view from '../view';

const { plugin, stream, prop, value, send, error, end } = chaiPlugin({ Kefir });
use(plugin);

describe('view', () => {
  it('should be a function', () => {
    expect(view).to.be.a('function');
  });

  it('should take a callback and return a function', () => {
    expect(view(x => x)).to.be.a('function');
  });

  it('should be able to be passed to Observable#thru', () => {
    expect(stream().thru(view(x => x))).to.be.an.observable.stream();
    expect(prop().thru(view(x => x))).to.be.an.observable.property();
  });

  it('should emit result from function callback', () => {
    const a = stream();

    expect(a.thru(view(x => !x))).to.emit([value(true)], () => {
      send(a, [value(false)]);
    });
  });

  it('should not emit result when equals previous', () => {
    const a = stream();

    expect(a.thru(view(x => !x))).to.emit([value(true)], () => {
      send(a, [value(false), value(false)]);
    });
  });

  it('should emit errors and end', () => {
    const a = stream();

    expect(a.thru(view(x => !x))).to.emit([error(true), end()], () => {
      send(a, [error(true), end()]);
    });
  });

  it('should emit undefined on the first element', () => {
    const a = stream();

    expect(a.thru(view(x => x))).to.emit([value(undefined), end()], () => {
      send(a, [value(undefined), end()]);
    });
  });
});

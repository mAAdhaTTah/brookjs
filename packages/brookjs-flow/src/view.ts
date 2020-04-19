import { Observable } from 'kefir';

const $$initialized = Symbol('init');

export const view = <I, O, E>(callback: (i: I) => O) => (
  stream$: Observable<I, E>,
): Observable<O, E> => {
  let previous: O | typeof $$initialized = $$initialized;

  return stream$.withHandler((emitter, event) => {
    switch (event.type) {
      case 'end':
        emitter.end();
        break;
      case 'error':
        emitter.error(event.value);
        break;
      case 'value':
        const next = callback(event.value);

        if (previous === $$initialized || next !== previous) {
          previous = next;
          emitter.value(next);
        }
        break;
    }
  });
};

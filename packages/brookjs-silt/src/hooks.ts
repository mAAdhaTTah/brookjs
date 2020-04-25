import { useRef, useEffect } from 'react';
import { Observable } from 'kefir';

export const useSingleton = <T>(creator: () => T): T => {
  const ref = useRef<T | null>(null);
  if (ref.current == null) {
    ref.current = creator();
  }
  return ref.current;
};

export const useSubscribe = <V>(
  obs$: Observable<V, never>,
  listener: (value: V) => void,
) => {
  useEffect(() => {
    const sub = obs$.observe(listener);

    return () => {
      sub.unsubscribe();
    };
  }, [obs$, listener]);
};

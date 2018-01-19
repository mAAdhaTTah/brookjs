import { Kefir } from 'brookjs';

export const isObs = x => x instanceof Kefir.Observable;

export const isString = is => typeof is === 'string';

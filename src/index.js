import { RAF, rafAction } from './action';
import children from './children';
import combineActionReducers from './combineActionReducers';
import component from './component';
import domDelta from './domDelta';
import events from './events';
import observeDelta from './observeDelta';
import { containerAttribute, createFixture, eventAttribute,
    mapActionTo } from './helpers';
import render, { raf$, renderFromHTML } from './render';

const brook = { children, combineActionReducers, component, events, domDelta,
    observeDelta, containerAttribute, createFixture, eventAttribute,
    mapActionTo, render, RAF, rafAction, raf$, renderFromHTML };

export { brook, children, combineActionReducers, component, events, domDelta,
    observeDelta, containerAttribute, createFixture, eventAttribute,
    mapActionTo, render, RAF, rafAction, raf$, renderFromHTML };

export default brook;

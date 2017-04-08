---
id: combineActionReducers
title: <code>combineActionReducers</code>
---

`combineActionReducers` is a function that takes an array of tuples and a default state, and returns a Redux reducer function. The reducer tuples should be array with a string, which the `action.type` is matched against, and a reducer function, that takes a `state` and the `action` and returns a new state.

## Parameters

* `{Array<ReducerTuple>} cond` - An array of ReducerTuples, where
    * type `ReducerTuple = [ActionType, ReducerFunction]`
* `{any} defaults` - Default state to return when no type matches.

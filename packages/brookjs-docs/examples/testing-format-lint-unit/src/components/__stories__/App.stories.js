import React from 'react';
import App from '../App';

export default {
  title: 'App'
};

export const emptyList = () => <App todos={[]} />;

export const withTodos = () => (
  <App todos={[{ name: 'First' }, { name: 'Second' }, { name: 'Third' }]} />
);

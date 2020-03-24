import React from 'react';
import { toJunction } from 'brookjs-silt';
import AddTodo from './AddTodo';

const App = ({ todos }) => {
  return (
    <main>
      <AddTodo />
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>{todo.name}</li>
        ))}
      </ul>
    </main>
  );
};

const events = {};

export default toJunction(events)(App);


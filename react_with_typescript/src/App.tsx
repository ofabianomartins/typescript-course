import React, { useState } from 'react';
import TodoList from './components/TodoList';
import NewTodo from './components/NewTodo';


const App: React.FC = () => {

  const [todos, setTodos] = useState<{id: string, text: string }[]>([]);

  const todoAddHandler = (text: string) => {
    setTodos(prevTodos => [ ...prevTodos, 
      { id: Math.random().toString(), text: text}
    ]);
  };

  const todoDeleteHAndler = (todoId: string) => {
    setTodos(prevTodos => {
      return prevTodos.filter(todo => todo.id !== todoId );
    });
  }
  return (
    <div className="App">
      <NewTodo onAddTodo={todoAddHandler} />
      <TodoList items={todos} onDeleteTodo={todoDeleteHAndler} />
    </div>
  );
}

export default App;

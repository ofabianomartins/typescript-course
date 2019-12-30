import React, { useState } from 'react';
import TodoListComponent from './components/TodoList';
import NewTodoComponent from './components/NewTodo';

import { TodoList } from './todo_list.model';


const App: React.FC = () => {

  const [todos, setTodos] = useState<TodoList[]>([]);

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
      <NewTodoComponent onAddTodo={todoAddHandler} />
      <TodoListComponent items={todos} onDeleteTodo={todoDeleteHAndler} />
    </div>
  );
}

export default App;

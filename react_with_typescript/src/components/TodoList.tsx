import React from 'react';
import { TodoList } from '../todo_list.model'

import './TodoList.css';

interface TodoListProps {
    items: TodoList[],
    onDeleteTodo: (todoId: string) => void
}

const TodoListComponent: React.FC<TodoListProps> = (props) => {
 
    return <ul>
        { props.items.map(item => 
        <li key={item.id}>
            <span>{item.text}</span>
            <button onClick={props.onDeleteTodo.bind(null,item.id)}> DELETE TODO</button>
        </li>)}
    </ul>
};

export default TodoListComponent;
import React from 'react';

import './TodoList.css';

interface TodoListProps {
    items: {id: string, text: string}[],
    onDeleteTodo: (todoId: string) => void
}

const TodoList: React.FC<TodoListProps> = (props) => {
 
    return <ul>
        { props.items.map(item => 
        <li key={item.id}>
            <span>{item.text}</span>
            <button onClick={props.onDeleteTodo.bind(null,item.id)}> DELETE TODO</button>
        </li>)}
    </ul>
};

export default TodoList;
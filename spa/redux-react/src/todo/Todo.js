/**
 * @file 列表中的一个Todo
 * @author leon <lupengyu@baidu.com>
 */

import React, {Component} from 'react';
import moment from 'moment';

export default class Todo extends Component {

    shouldComponentUpdate(nextProps) {
        return nextProps.todo !== this.props.todo;
    }

    render() {

        const {
            todo,
            onDone,
            onDelete
        } = this.props;

        return (
            <li className={todo.done ? 'todo-done' : ''}
                style={{borderColor: todo.category ? todo.category.color : ''}}
            >
                <h3>{todo.title}</h3>
                <p>{todo.desc}</p>
                <div className="todo-meta">
                    {todo.category ? `${todo.category.title} | ` : ''}
                    预期完成时间: {moment(todo.endTime).format('YYYY-MM-DD, h:mm a')}
                </div>
                <a className="fa fa-pencil" href={`#/edit/${todo.id}`}></a>
                <i className="fa fa-check" onClick={onDone} data-id={todo.id}></i>
                <i className="fa fa-trash-o" onClick={onDelete} data-id={todo.id}></i>
            </li>
        );
    }
}

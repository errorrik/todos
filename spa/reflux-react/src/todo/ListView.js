import React, {Component, PropTypes} from 'react'
import moment from 'moment'

export default class TodoList extends Component {
    constructor(props) {
        super(props);
        this.doneClicker = this.doneClicker.bind(this);
        this.rmClicker = this.rmClicker.bind(this);
    }

    render() {
        return (
            <ul className="todo-list">
            {this.props.todos.map(todo => 
                <li className={todo.done ? 'todo-done' : ''}
                    style={{borderColor: todo.category ? todo.category.color : ''}}
                >
                    <h3>{todo.title}</h3>
                    <p>{todo.desc}</p>
                    <div className="todo-meta">
                        {todo.category ? `${todo.category.title} | ` : ''}预期完成时间: {moment(todo.endTime).format('YYYY-MM-DD, h:mm a')}
                    </div>
                    <a className="fa fa-pencil" href={`#/edit/${todo.id}`}></a>
                    <i className="fa fa-check" onClick={this.doneClicker} data-id={todo.id}></i>
                    <i className="fa fa-trash-o" onClick={this.rmClicker} data-id={todo.id}></i>
                </li>
            )}
            </ul>
        );
    }

    doneClicker(e) {
        let id = +e.target.getAttribute('data-id');
        this.props.doneMethod(id);
    }

    rmClicker(e) {
        let id = +e.target.getAttribute('data-id');
        this.props.rmMethod(id);
    }
}



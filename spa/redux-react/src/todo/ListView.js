import React, {Component} from 'react'
import Todo from './Todo';

export default class TodoList extends Component {
    constructor(props) {
        super(props);
        this.doneClicker = this.doneClicker.bind(this);
        this.rmClicker = this.rmClicker.bind(this);
    }

    componentWillUpdate() {
        if (this.perf === 1) {
            this.startTime = new Date().getTime();
        }
    }

    componentDidUpdate() {
        if (this.perf === 1) {
            this.perf = 0;
            console.log(new Date() - this.startTime);
        }
    }

    render() {
        return (
            <ul className="todo-list">
            {this.props.todos.map(todo => {
                return <Todo
                    todo={todo}
                    key={todo.id}
                    onDone={this.doneClicker}
                    onDelete={this.rmClicker} />;
            })}
            </ul>
        );
    }

    doneClicker(e) {
        this.perf = 1;
        let id = +e.target.getAttribute('data-id');
        this.props.doneMethod(id);
    }

    rmClicker(e) {
        this.perf = 1;
        let id = +e.target.getAttribute('data-id');
        this.props.rmMethod(id);
    }
}

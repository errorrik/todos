import todosStore from './store'
import todoActions from './actions'
import categoriesStore from '../category/store'
import categoriyActions from '../category/actions'

import React, {Component} from 'react'
import Reflux from 'reflux'
import {connector} from 'reflux-state-mixin'

import TodoList from './ListView.js'
import CategoryFilter from '../category/Filter'



export default class ListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            todos: todosStore.getData(),
            categories: categoriesStore.getData(),
            category: 0
        };
    }

    onStateChange(nextState) {
        this.setState(nextState);
    }

    componentDidMount() {
        this.unsubTodos = todosStore.listen(todos => {
            this.onStateChange({todos});
        });
        this.unsubCategories = categoriesStore.listen(categories => {
            this.onStateChange({categories});
        });

        let category = this.props.params.category;
        this.setState({category});
        todoActions.list(category);

        categoriyActions.list();
    }

    componentWillUnmount() {
        this.unsubTodos();
        this.unsubCategories();

    }

    componentWillReceiveProps(nextProps) {
        let category = nextProps.params.category;
        this.setState({category});

        todoActions.list(category);
    }

    render() {
        const {todos, categories, category} = this.state;
        return (
            <div>
                <a href="#/add" className="todo-add"><i className="fa fa-plus-square"></i></a>
                <CategoryFilter datasource={categories} value={category}></CategoryFilter>
                <a href="#/" className="fa fa-close filter-category-clear" style={{display: category ? '' : 'none'}}></a>
                <TodoList todos={todos} doneMethod={this.doneTodo} rmMethod={this.rmTodo}/>
            </div>
        );
    }

    doneTodo(id) {
        todoActions.done(id);
    }

    rmTodo(id) {
        todoActions.rm(id);
    }
}



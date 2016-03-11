import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import CategoryFilter from './CategoryFilter.js'
import TodoList from './ListView.js'
import * as service from '../service.js'
import store from '../../index.js'
import {fetchTodos, doneTodo, rmTodo} from './action.js'
import {fetchCategories} from '../category/action.js'


class ListPage extends Component {
    constructor(props) {
        super(props);
        this.doneTodo = this.doneTodo.bind(this);
        this.rmTodo = this.rmTodo.bind(this);
    }

    componentWillMount() {
        const {dispatch, params: {category}} = this.props;
        dispatch(fetchTodos(category));

        dispatch(fetchCategories());
    }

    componentWillReceiveProps(nextProps) {
        const {dispatch, params: {category}} = nextProps;

        if (this.props.params.category != category) {
            dispatch(fetchTodos(category));
        }
    }

    render() {
        const {todos: {category, list: todosData}, categories: {list: categoriesData}} = this.props;
        return (
            <div>
                <a href="#/add" className="todo-add"><i className="fa fa-plus-square"></i></a>
                <CategoryFilter datasource={categoriesData} value={category}></CategoryFilter>
                <a href="#/" className="fa fa-close filter-category-clear" style={{display: category ? '' : 'none'}}></a>
                <TodoList todos={todosData} doneMethod={this.doneTodo} rmMethod={this.rmTodo}/>
            </div>
        );
    }

    doneTodo(id) {
        this.props.dispatch(doneTodo(id));
    }

    rmTodo(id) {
        this.props.dispatch(rmTodo(id));
    }
}


ListPage.propTypes = {
    todos: PropTypes.object.isRequired,
    categories: PropTypes.object.isRequired,
    category: PropTypes.any,
    params: PropTypes.object
};

export default connect(function (state) {
    return state;
})(ListPage)


import React, {Component} from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import App from './src/App.js'
import './src/index.css'
import 'font-awesome/css/font-awesome.css'
import {
    ReduxRouter,
    reduxReactRouter,
    routerStateReducer
} from 'redux-router'
import { createHistory } from 'history'
import {
    Route,
    Link,
    IndexRoute
} from 'react-router'
import todosReducer, {editingTodo as editingTodoReducer} from './src/todo/reducer.js'
import categoriesReducer, {addingCategory as addingCategoryReducer} from './src/category/reducer.js'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import createHashHistory from 'history/lib/createHashHistory'
import TodoListPage from './src/todo/ListPage.js'
import TodoFormPage from './src/todo/FormPage.js'
import AddCategoryPage from './src/category/AddPage.js'
import EditCategoryPage from './src/category/EditPage.js'
import Page404 from './src/Page404.js'

const store = createStore(
    combineReducers({
        router: routerStateReducer,
        todos: todosReducer,
        editingTodo: editingTodoReducer,
        categories: categoriesReducer,
        addingCategory: addingCategoryReducer
    }),
    compose(
        applyMiddleware(thunk),
        reduxReactRouter({
            createHistory: createHashHistory
        })
    )
);


// <IndexRoute component={Page404} />

render(
    <Provider store={store}>
        <ReduxRouter>
            <Route path="/" component={App}>
                <IndexRoute component={TodoListPage} />
                <Route path="todos/category/:category" component={TodoListPage} />
                <Route path="todos" component={TodoListPage} />
                <Route path="add" component={TodoFormPage} />
                <Route path="edit/:id" component={TodoFormPage} />
                <Route path="category/add" component={AddCategoryPage} />
                <Route path="category/edit" component={EditCategoryPage} />
                <Route path="*" component={Page404} />
            </Route>
        </ReduxRouter>
    </Provider>,
    document.getElementById('wrap')
)

export default store




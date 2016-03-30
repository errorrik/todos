import './src/index.css'
import 'font-awesome/css/font-awesome.css'

import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, Redirect} from 'react-router'

import App from './src/App'
import Page404 from './src/Page404'
import TodoListPage from './src/todo/ListPage'
import TodoFormPage from './src/todo/FormPage'


ReactDOM.render(
    (<Router>
        <Route component={App}>
            <Route name="404" path="/404" component={Page404} />
            <Route name="todos" path="/todos" component={TodoListPage} />
            <Route path="todos/category/:category" component={TodoListPage} />
            <Route path="/add" component={TodoFormPage} />
            <Route path="/edit/:id" component={TodoFormPage} />
            <Redirect from="*" to="/todos" />
        </Route>
    </Router>),
    document.getElementById('wrap')
);


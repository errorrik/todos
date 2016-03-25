import {Component} from 'angular2/core'
import TodoListPage from './todo/ListPage'
import TodoFormPage from './todo/FormPage'
import CategoryAddPage from './category/Add'
import CategoryEditPage from './category/Edit'
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router'

@Component({
    selector: '#wrap',
    template: '<router-outlet></router-outlet>',
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    {path: '/', name: 'Todos', component: TodoListPage},
    {path: '/todos/category/:category', name: 'CategoryTodos', component: TodoListPage},
    {path: '/add', name: 'AddTodo', component: TodoFormPage},
    {path: '/edit/:id', name: 'EditTodo', component: TodoFormPage},
    {path: '/category/add', name: 'AddCategory', component: CategoryAddPage},
    {path: '/category/edit', name: 'EditCategory', component: CategoryEditPage}
])
export class App { }


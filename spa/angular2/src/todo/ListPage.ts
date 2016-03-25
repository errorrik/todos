import {Component} from 'angular2/core'
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router'
import TodoService from './service'
import CategoryService from '../category/service'
import {DateFormatPipe} from '../common'

@Component({
    templateUrl: '/src/todo/ListPage.html',
    providers: [TodoService, CategoryService],
    pipes: [DateFormatPipe],
    directives: [ROUTER_DIRECTIVES]
})
export default class ListPage {
    constructor(
        private todoService: TodoService,
        private categoryService: CategoryService,
        private routeParams: RouteParams
    ) {
    }

    ngOnInit() {
        let category = +this.routeParams.get('category');
        this.category = category;
        let promises = [
            this.todoService.list(category),
            this.categoryService.list()
        ];

        Promise.all(promises).then(([todos, categories]) => {
            this.todos = todos;
            this.categories = categories;
        });
    }

    rmTodo(index) {
        let todo = this.todos[index];
        this.todos.splice(index, 1);
        this.todoService.rm(todo.id);
    }

    doneTodo(index) {
        let todo = this.todos[index];
        if (!todo.done) {
            todo.done = true;
            this.todoService.done(todo.id);
        }
    }
}
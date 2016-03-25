import {
    Component, 
    EventEmitter, 
    ApplicationRef, 
    DynamicComponentLoader
} from 'angular2/core'
import {RouteParams, ROUTER_DIRECTIVES} from 'angular2/router'
import TodoService from './service'
import CategoryService from '../category/service'
import CategoryPicker from '../category/Picker'
import TimePicker from '../component/TimePicker'
import Calendar from '../component/Calendar'
import AddCategory from '../category/Add'
import EditCategory from '../category/Edit'

@Component({
    selector: 'AddCategoryLayer',
    template: `
        <div class="ui-layer add-category-layer"
            [style.top]="'100px'"
            [style.left]="left">
            <AddCategory (canceled)="canceledHandler($event)" (added)="addedHandler($event)"></AddCategory>
        </div>
    `,
    directives: [AddCategory]
})
class AddCategoryLayer {
    ngOnInit() {
        this.left = window.screen.availWidth / 2 - 100 + 'px';
    }

    added = new EventEmitter();
    canceled = new EventEmitter();

    canceledHandler(e) {
        e.returnValue = false;
        this.canceled.emit();
    }

    addedHandler(e) {
        e.returnValue = false;
        this.added.emit();
    }
}

@Component({
    selector: 'EditCategoryLayer',
    template: `
        <div class="ui-layer edit-category-layer"
            [style.top]="'100px'"
            [style.left]="left">
            <i class="fa fa-times-circle-o" (click)="closeHandler()"></i>
            <EditCategory (changed)="changeHandler()"></EditCategory>
        </div>
    `,
    directives: [EditCategory]
})
class EditCategoryLayer {
    ngOnInit() {
        this.left = window.screen.availWidth / 2 - 100 + 'px';
    }

    changed = new EventEmitter();
    close = new EventEmitter();

    changeHandler(e) {
        this.changed.emit(e);
    }

    closeHandler() {
        this.close.emit();
    }
}

@Component({
    templateUrl: '/src/todo/FormPage.html',
    providers: [TodoService, CategoryService],
    directives: [
        ROUTER_DIRECTIVES, 
        CategoryPicker, 
        TimePicker, 
        Calendar, 
        AddCategoryLayer, 
        EditCategoryLayer
    ]
})
export default class FormPage {
    constructor(
        private todoService: TodoService,
        private categoryService: CategoryService,
        private routeParams: RouteParams,
        private appRef: ApplicationRef,
        private dcl: DynamicComponentLoader
    ) {
        this.todo = {};
    }

    ngOnInit() {
        let now = new Date();
        let todoPromise = Promise.resolve({
            id: 0,
            title: '',
            desc: '',
            endTime: now.getTime(),
            categoryId: null,
            done: false
        });

        let id = +this.routeParams.get('id');
        this.id = id;
        if (id) {
            todoPromise = this.todoService.get(id);
        }

        todoPromise.then(todo => {
            let endTime = new Date(todo.endTime);

            todo.endTimeDate = new Date(endTime.getFullYear(), endTime.getMonth(), endTime.getDate());
            todo.endTimeHour = endTime.getHours();
            this.todo = todo;
        });

        this.updateCategories();
    }

    updateCategories() {
        this.categoryService.list().then(categories => {
            this.categories = categories;
        });
    }

    submit() {
        let endTime = new Date(this.todo.endTimeDate.getTime());
        endTime.setHours(this.todo.endTimeHour);
        endTime.setMinutes(0);
        endTime.setSeconds(0);
        this.todo.endTime = endTime.getTime();

        let submitPromise;
        if (this.id) {
            submitPromise = this.todoService.edit(this.todo);
        }
        else {
            submitPromise = this.todoService.add(this.todo);
        }

        submitPromise.then(() => {
            history.back();
        });
    }

    cancel() {
        history.back();
    }

    addCategoryClicker() {
        this.dcl.loadNextToLocation(AddCategoryLayer, this.appRef._rootComponents[0].location)
            .then(ref => {
                this.addCategoryLayer = ref;
                ref.instance.datasource = this.datasource;
                ref.instance.added.subscribe({
                    next: () => {
                        this.updateCategories();
                        this.addCategoryLayer.dispose();
                    }
                });
                ref.instance.canceled.subscribe({
                    next: () => {
                        this.addCategoryLayer.dispose();
                    }
                });
            });
    }

    editCategoryClicker() {
        this.dcl.loadNextToLocation(EditCategoryLayer, this.appRef._rootComponents[0].location)
            .then(ref => {
                this.editCategoryLayer = ref;
                ref.instance.datasource = this.datasource;
                ref.instance.changed.subscribe({
                    next: () => {
                        this.updateCategories();
                    }
                });
                ref.instance.close.subscribe({
                    next: () => {
                        this.editCategoryLayer.dispose();
                    }
                });
            });
    }
}

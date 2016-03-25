import {Component, Optional, EventEmitter} from 'angular2/core'
import CategoryService from '../category/service'
import ColorPicker from '../component/ColorPicker'
import {RouteParams} from 'angular2/router'
import {COLORS} from '../config'

@Component({
    selector: 'EditCategory',
    template: `
        <ul class="edit-category-list">
            <li *ngFor="#item of categories; #i = index">
                <input type="text" [(ngModel)]="item.title" class="form-title">
                <ColorPicker [datasource]="colors" [(ngModel)]="item.color"></ColorPicker>
                <i class="fa fa-check" (click)="edit(i)"></i>
                <i class="fa fa-trash" (click)="rm(i)"></i>
            </li>
        </ul>
    `,
    providers: [CategoryService],
    directives: [ColorPicker],
    outputs: ['changed']
})
export default class Edit {
    constructor(
        private categoryService: CategoryService,
        @Optional() private routeParams: RouteParams
    ) {
        this.colors = COLORS.slice(0);
    }

    ngOnInit() {
        this.categoryService.list().then(categories => {
            this.categories = categories;
        });
    }

    changed = new EventEmitter();

    edit(index) {
        this.categoryService.edit(this.categories[index])
            .then(() => {
                this.changed.emit();
            });
        
    }

    rm(index) {
        this.categoryService.rm(this.categories[index].id)
            .then(() => {
                this.changed.emit();
            });
        this.categories.splice(index, 1);
    }
}
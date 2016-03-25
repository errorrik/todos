import {Component, Optional, EventEmitter} from 'angular2/core'
import CategoryService from '../category/service'
import ColorPicker from '../component/ColorPicker'
import {RouteParams} from 'angular2/router'
import {COLORS} from '../config'

@Component({
    selector: 'AddCategory',
    template: `
        <div class="form">
            <input type="text" placeholder="分类" class="form-title" [(ngModel)]="title">
            <ColorPicker [datasource]="colors" [(ngModel)]="color"></ColorPicker>
            <div class="form-op">
                <button type="button" class="form-ok" (click)="submit()"><i class="fa fa-check-circle-o"></i></button>
                <button type="button" class="form-cancel" (click)="cancel()"><i class="fa fa-times-circle-o"></i></button>
            </div>
        </div>
    `,
    providers: [CategoryService],
    directives: [ColorPicker],
    outputs: ['canceled', 'added']
})
export default class Add {
    constructor(
        private categoryService: CategoryService,
        @Optional() private routeParams: RouteParams
    ) {
        this.colors = COLORS.slice(0);
    }

    added = new EventEmitter(false);
    canceled = new EventEmitter(false);

    submit() {
        if (!this.title) {
            return;
        }

        let category = {
            title: this.title,
            color: this.color
        };
        this.categoryService.add(category).then(() => {
            let e = {};
            this.added.next(e);
            if (e.returnValue !== false) {
                this.back();
            }
        });
    }

    cancel() {
        let e = {};
        this.canceled.next(e);
        if (e.returnValue !== false) {
            this.back();
        }
    }

    back() {
        history.back();
    }
}

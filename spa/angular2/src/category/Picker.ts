import {Component, Optional} from 'angular2/core'
import {NgControl} from 'angular2/common';


@Component({
    selector: 'CategoryPicker',
    template: `
        <ul class="ui-categorypicker">
            <li 
                *ngFor="#item of datasource" 
                [style.background]="item.color"
                [class.selected]="item.id == value"
                (click)="itemClick(item)"
            >{{ item.title }}</li>
        </ul>
    `,
    inputs: ['datasource']
})
export default class Picker {
    constructor(
        @Optional() ngControl: NgControl
    ) {
        if (ngControl) {
            ngControl.valueAccessor = this;
        }
    }

    itemClick(item) {
        let value = item.id;
        this.writeValue(value);
        this.onChange(value);
    }

    onChange = () => {};
    onTouched = () => {};

    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }

    writeValue(value) {
        this.value = value;
    }
}
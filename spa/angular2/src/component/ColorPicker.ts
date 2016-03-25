import {Component, Optional} from 'angular2/core'
import {NgControl} from 'angular2/common';


@Component({
    selector: 'ColorPicker',
    template: `
        <ul class="ui-colorpicker">
            <li 
                *ngFor="#item of datasource" 
                [style.background]="item"
                [class.selected]="item == value"
                (click)="itemClick(item)"
            ></li>
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

    itemClick(value) {
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
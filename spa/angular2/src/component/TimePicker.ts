import {
    Component, 
    EventEmitter, 
    Optional, 
    DynamicComponentLoader, 
    ElementRef, 
    ApplicationRef, 
    Pipe, 
    PipeTransform
} from 'angular2/core'
import {NgControl} from 'angular2/common'
import {PositionService} from '../common'

@Pipe({name: 'valueText'})
class ValueTextPipe implements PipeTransform {
    transform(value, args) {
        if (value) {
            let text = '';
            args[0].forEach(item => {
                if (item.value == value) {
                    text = item.text;
                    return false;
                }
            })

            return text;
        }

        return '';
    }
}

@Component({
    selector: 'TimePickerLayer',
    template: `
        <ul class="ui-layer ui-timepicker-layer" [style.left]="left" [style.top]="top">
            <li 
                *ngFor="#item of datasource"
                [class.selected]="item.value == value"
                (click)="itemClick(item)"
            >{{ item.text }}</li>
        </ul>
    `
})
class Layer {
    ngOnInit() {
        this.left = '-1000px';
    }

    valueChange = new EventEmitter();

    itemClick(item) {
        this.value = item.value;
        this.valueChange.emit(item.value);
    }
}

const posService = new PositionService();

@Component({
    selector: 'TimePicker',
    template: `
        <div (click)="mainClick()" class="ui-timepicker">{{ value | valueText:datasource }}</div>
    `,
    pipes: [ValueTextPipe],
    directives: [Layer]
})
export default class TimePicker {
    constructor(
        @Optional() ngControl: NgControl,
        private elementRef: ElementRef,
        private appRef: ApplicationRef,
        private dcl: DynamicComponentLoader
    ) {
        this.datasource = [
            {text: '12:00am', value: 0},
            {text: '1:00am', value: 1},
            {text: '2:00am', value: 2},
            {text: '3:00am', value: 3},
            {text: '4:00am', value: 4},
            {text: '5:00am', value: 5},
            {text: '6:00am', value: 6},
            {text: '7:00am', value: 7},
            {text: '8:00am', value: 8},
            {text: '9:00am', value: 9},
            {text: '10:00am', value: 10},
            {text: '11:00am', value: 11},
            {text: '12:00pm', value: 12},
            {text: '1:00pm', value: 13},
            {text: '2:00pm', value: 14},
            {text: '3:00pm', value: 15},
            {text: '4:00pm', value: 16},
            {text: '5:00pm', value: 17},
            {text: '6:00pm', value: 18},
            {text: '7:00pm', value: 19},
            {text: '8:00pm', value: 20},
            {text: '9:00pm', value: 21},
            {text: '10:00pm', value: 22},
            {text: '11:00pm', value: 23}
        ];

        if (ngControl) {
            ngControl.valueAccessor = this;
        }

        this.docClicker = (e) => {
            let input = $(e.target).closest(this.elementRef.nativeElement);
            if (input.length === 0) {
                this.layerRef.instance.left = '-1000px';
            }
        };

        // datasource是个数组，所以通过then传
        // 如果想走provider，需要定义个类型
        dcl.loadNextToLocation(Layer, this.appRef._rootComponents[0].location)
            .then(ref => {
                this.layerRef = ref;
                ref.instance.datasource = this.datasource;
                ref.instance.valueChange.subscribe({
                    next: (value) => {
                        this.writeValue(value);
                        this.onChange(value);
                    }
                });
                $(document).on('click', this.docClicker);
            });
    }

    valueChange = new EventEmitter();

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

    mainClick() {
        let pos = posService.offset(this.elementRef.nativeElement);
        this.layerRef.instance.left = `${pos.left}px`;
        this.layerRef.instance.top = `${pos.top + pos.height + 2}px`;
        this.layerRef.instance.value = this.value;
    }

    ngOnDestroy() {
        $(document).off('click', this.docClicker);
        if (this.layerRef) {
            this.layerRef.dispose();
        }
    }
}
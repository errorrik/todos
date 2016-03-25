import {
    Component, 
    EventEmitter, 
    Optional, 
    DynamicComponentLoader, 
    ElementRef, 
    ApplicationRef
} from 'angular2/core'
import {NgControl} from 'angular2/common'
import {PositionService} from '../common'
import {DateFormatPipe} from '../common'

@Component({
    selector: 'CalendarLayer',
    template: `
        <div class="ui-layer ui-calendar-layer" [style.left]="left" [style.top]="top">
            <div class="ui-calendar-func">
                <i class="fa fa-angle-left" (click)="prevMonth()"></i>
                <b>{{viewYear}}-{{viewMonth + 1}}</b>
                <i class="fa fa-angle-right" (click)="nextMonth()"></i>
            </div>
            <ol class="date-head">
                <li>一</li>
                <li>二</li>
                <li>三</li>
                <li>四</li>
                <li>五</li>
                <li>六</li>
                <li>日</li>
            </ol>
            <ol>
                <li *ngFor="#date of viewDates"
                    (click)="dateClick(date)"
                    [class.selected]="
                        date == value.getDate() 
                            && viewYear == value.getFullYear() 
                            && viewMonth == value.getMonth()"
                >{{date}}</li>
            </ol>
        </div>
    `
})
class Layer {
    ngOnInit() {
        this.left = '-1000px';
    }

    valueChange = new EventEmitter();

    dateClick(date) {
        let value = new Date(this.viewYear, this.viewMonth, date);
        this.value = value;
        this.valueChange.emit(value);
        this.left = '-1000px';
    }

    nextMonth() {
        let viewDate = new Date(this.viewYear, this.viewMonth + 1, 1);
        this.viewYear = viewDate.getFullYear();
        this.viewMonth = viewDate.getMonth();
        this.updateViewDates();
    }

    prevMonth() {
        let viewDate = new Date(this.viewYear, this.viewMonth - 1, 1);
        this.viewYear = viewDate.getFullYear();
        this.viewMonth = viewDate.getMonth();
        this.updateViewDates();
    }

    updateViewDates() {
        let dates = [];
        let viewDate = new Date(this.viewYear, this.viewMonth, 1);
        let day = viewDate.getDay() - 1;
        for (; day % 7; day--) {
            dates.push('');
        }

        let nextMonth = new Date(this.viewYear, this.viewMonth + 1, 1);
        let days = (nextMonth - viewDate) / 24 / 60 / 60 / 1000;
        for (let i = 1; i <= days; i++) {
            dates.push(i);
        }

        this.viewDates = dates;
    }

    reset(value) {
        this.viewYear = value.getFullYear();
        this.viewMonth = value.getMonth();
        this.value = value;

        this.updateViewDates();
    }
}

const posService = new PositionService();

@Component({
    selector: 'Calendar',
    template: `
        <div (click)="mainClick()" class="ui-calendar">{{ value | formatDate: 'YYYY-MM-DD' }}</div>
    `,
    pipes: [DateFormatPipe],
    directives: [Layer]
})
export default class Calendar {
    constructor(
        @Optional() ngControl: NgControl,
        private elementRef: ElementRef,
        private appRef: ApplicationRef,
        private dcl: DynamicComponentLoader
    ) {
        if (ngControl) {
            ngControl.valueAccessor = this;
        }

        this.docClicker = (e) => {
            let target = $(e.target);
            let closestMain = target.closest(this.elementRef.nativeElement);
            let closestLayer = target.closest(this.layerRef.location.nativeElement);
            if (closestMain.length === 0 && closestLayer.length === 0) {
                this.layerRef.instance.left = '-1000px';
            }
        };

        // datasource是个数组，所以通过then传
        // 如果想走provider，需要定义个类型
        dcl.loadNextToLocation(Layer, this.appRef._rootComponents[0].location)
            .then(ref => {
                this.layerRef = ref;
                ref.instance.valueChange.subscribe({
                    next: (value) => {
                        this.writeValue(value);
                        this.onChange(value);
                    }
                });
                $(document).on('click', this.docClicker);
            });
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

    mainClick() {
        let pos = posService.offset(this.elementRef.nativeElement);
        this.layerRef.instance.left = `${pos.left}px`;
        this.layerRef.instance.top = `${pos.top + pos.height + 2}px`;
        this.layerRef.instance.reset(this.value);
    }

    ngOnDestroy() {
        $(document).off('click', this.docClicker);
        if (this.layerRef) {
            this.layerRef.dispose();
        }
    }
}
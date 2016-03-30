import React, {Component} from 'react'
import {render, findDOMNode} from 'react-dom'
import $ from "jquery"
import Layer from './Layer.js'
import moment from 'moment'

export default class Calendar extends Component {
    constructor(props) {
        super(props);

        this.mainClick = this.mainClick.bind(this);
        this.dateClick = this.dateClick.bind(this);
        this.docClicker = this.docClick.bind(this);
        this.prevMonth = this.prevMonth.bind(this);
        this.nextMonth = this.nextMonth.bind(this);

        this.state = this.initState();
    }

    initState(props) {
        props = props || this.props;
        let value = props.initValue;
        if (!value) {
            value = new Date();
        }

        const viewYear = value.getFullYear();
        const viewMonth = value.getMonth();

        return {value, viewYear, viewMonth};
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.initState(nextProps));
    }

    componentDidMount() {
        this._layer = new Layer({});
        this._layer.mount();
        this._layer.render(this.renderLayer());

        $(document).on('click', this.docClicker);
    }

    componentWillUnmount() {
        if (this._layer) {
            this._layer.destory();
            this._layer = null;

            $(document).off('click', this.docClicker);
        }
    }

    destory() {
        this.docClicker = null;
    }

    render() {
        if (this._layer) {
            this._layer.render(this.renderLayer());
        }
        return (
            <div className="ui-calendar" onClick={this.mainClick}>{moment(this.state.value).format('YYYY-MM-DD')}</div>
        );
    }

    renderLayer() {
        let {viewMonth, viewYear, value} = this.state;
        let dates = [];
        let viewDate = new Date(viewYear, viewMonth, 1)
        let day = viewDate.getDay() - 1;
        for (; day % 7; day--) {
            dates.push('');
        }

        viewYear = viewDate.getFullYear();
        viewMonth = viewDate.getMonth();

        let nextMonth = new Date(viewYear, viewMonth + 1, 1);
        let days = (nextMonth - viewDate) / 24 / 60 / 60 / 1000;
        for (let i = 1; i <= days; i++) {
            dates.push(i);
        }

        return (
            <div className="ui-calendar-layer">
                <div className="ui-calendar-func">
                    <i className="fa fa-angle-left" onClick={this.prevMonth}></i>
                    <b>{viewYear}-{viewMonth + 1}</b>
                    <i className="fa fa-angle-right" onClick={this.nextMonth}></i>
                </div>
                <ol className="date-head">
                    <li>一</li>
                    <li>二</li>
                    <li>三</li>
                    <li>四</li>
                    <li>五</li>
                    <li>六</li>
                    <li>日</li>
                </ol>
                <ol>
                {dates.map(item => 
                    <li onClick={this.dateClick}
                        className={
                            item == value.getDate() 
                                && viewYear == value.getFullYear() 
                                && viewMonth == value.getMonth() 
                            ? 'selected' 
                            : ''
                        }
                        data-date={item}
                        data-month={viewMonth}
                        data-year={viewYear}
                    >{item}</li>
                )}
                </ol>
            </div>
        );
    }

    docClick(e) {
        let input = $(e.target).closest(this._layer.el);
        if (input.length === 0 && e.target != findDOMNode(this)) {
            this.hideLayer();
        }
    }

    dateClick(e) {
        const target = e.target;
        const date = target.getAttribute('data-date');
        const month = target.getAttribute('data-month');
        const year = target.getAttribute('data-year');

        if (date) {
            const value = new Date(+year, +month, +date);
            this.setState(
                Object.assign({}, this.state, {value})
            );
        }
    }

    mainClick() {
        this[this.isLayerShow ? 'hideLayer' : 'showLayer']();
    }

    prevMonth() {
        this.setState(
            Object.assign({}, this.state, {viewMonth: this.state.viewMonth - 1})
        );
    }

    nextMonth() {
        this.setState(
            Object.assign({}, this.state, {viewMonth: this.state.viewMonth + 1})
        );
    }

    hideLayer() {
        this._layer.pos({left: -1000});
        this.isLayerShow = false;
    }

    showLayer() {
        let el = findDOMNode(this);
        let pos = $(el).offset();
        this._layer.pos({
            left: pos.left, 
            top: pos.top + el.offsetHeight + 1
        });
        this.isLayerShow = true;
    }
}
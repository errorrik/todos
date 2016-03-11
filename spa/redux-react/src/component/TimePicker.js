import React, {Component} from 'react'
import {render, findDOMNode} from 'react-dom'
import $ from "jquery"
import Layer from './Layer.js'

const DATASOURCE = [
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

export default class TimePicker extends Component {
    constructor(props) {
        super(props);
        this.datasource = DATASOURCE;

        this.mainClick = this.mainClick.bind(this);
        this.itemClick = this.itemClick.bind(this);
        this.docClicker = this.docClick.bind(this);

        this.state = {
            value: this.props.initValue
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.initValue
        });
    }

    componentDidMount() {
        this._layer = new Layer({
            className: 'ui-timepicker-layer'
        });
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

    renderLayer() {
        let datasource = this.datasource;
        return (
            <ul>
            {datasource.map((item, index) => 
                <li className={item.value == this.props.value ? 'selected' : ''} 
                    onClick={this.itemClick}
                    data-index={index}
                >{item.text}</li>
            )}
            </ul>
        );
    }

    render() {
        let valueText = '';
        this.datasource.forEach(item => {
            if (item.value == this.state.value) {
                valueText = item.text;
            }
        });

        return (
            <div className="ui-timepicker" onClick={this.mainClick}>{valueText}</div>
        );
    }

    mainClick() {
        this[this.isLayerShow ? 'hideLayer' : 'showLayer']();
    }

    itemClick(e) {
        let index = +e.target.getAttribute('data-index');
        this.setState({
            value: this.datasource[index].value
        });
    }

    docClick(e) {
        if (e.target != findDOMNode(this)) {
            this.hideLayer();
        }
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
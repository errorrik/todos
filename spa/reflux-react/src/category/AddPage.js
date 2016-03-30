import React, {Component, PropTypes} from 'react'
import actions from './actions'
import store from './currentStore'
import ColorPicker from '../component/ColorPicker'
import {colors} from '../config.js'


export default class AddPage extends Component {
    constructor(props) {
        super(props);

        this.state = store.getData();

        this.okClicker = this.okClicker.bind(this);
        this.cancelClicker = this.cancelClicker.bind(this);
        this.titleChange = this.titleChange.bind(this);
    }

    componentWillMount() {
        this.unsub = store.listen(category => {
            if (category.requestCompleted) {
                this.finish();
                actions.resetItem();
                return;
            }
            this.onStateChange(category);
        });
    }

    onStateChange(nextState) {
        this.setState(nextState);
    }

    componentWillUnmount() {
        this.unsub();
    }

    render() {
        return (
            <div className="form">
                <input type="text" placeholder="分类" className="form-title" ref="title" value={this.state.title} onChange={this.titleChange}/>
                <ColorPicker datasource={colors} ref="color"></ColorPicker>
                <div className="form-op">
                    <button className="form-ok" onClick={this.okClicker}><i className="fa fa-check-circle-o"></i></button>
                    <button className="form-cancel" onClick={this.cancelClicker}><i className="fa fa-times-circle-o"></i></button>
                </div>
            </div>
        );
    }

    titleChange(e) {
        this.setState(Object.assign({}, this.state, {title: e.target.value}));
    }

    okClicker() {
        let category = {
            title: this.refs.title.value,
            color: this.refs.color.state.value
        };

        if (!category.title) {
            return;
        }

        actions.add(category);
    }

    cancelClicker() {
        this.abort();
    }

    finish() {
        if (this.props.onFinish) {
            this.props.onFinish();
        }
        else {
            this.props.history.goBack();
        }
    }

    abort() {
        if (this.props.onAbort) {
            this.props.onAbort();
        }
        else {
            this.props.history.goBack();
        }
    }
}


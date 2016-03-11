import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {startAddCategory, submitAddCategory, submitAddCategoryFinished, abortAddCategory} from './action.js'
import ColorPicker from '../component/ColorPicker.js'
import {colors} from '../config.js'


export class AddPage extends Component {
    constructor(props) {
        super(props);

        this.okClicker = this.okClicker.bind(this);
        this.cancelClicker = this.cancelClicker.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(startAddCategory());
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.current.isUpdated) {
            this.finish();
            return;
        }

        if (nextProps.current.abort) {
            this.abort();
            return;
        }
    }

    render() {
        return (
            <div className="form">
                <input type="text" placeholder="分类" className="form-title" ref="title" />
                <ColorPicker datasource={colors} ref="color"></ColorPicker>
                <div className="form-op">
                    <button className="form-ok" onClick={this.okClicker}><i className="fa fa-check-circle-o"></i></button>
                    <button className="form-cancel" onClick={this.cancelClicker}><i className="fa fa-times-circle-o"></i></button>
                </div>
            </div>
        );
    }

    okClicker() {
        let category = {
            title: this.refs.title.value,
            color: this.refs.color.state.value
        };

        if (!category.title) {
            return;
        }

        this.props.dispatch(submitAddCategory(category));
    }

    cancelClicker() {
        this.props.dispatch(abortAddCategory());
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

export default connect(function (state) {
    return {
        current: state.addingCategory
    };
})(AddPage)

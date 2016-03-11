import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {fetchCategories, submitEditCategory, submitRmCategory} from './action.js'
import ColorPicker from '../component/ColorPicker.js'
import {colors} from '../config.js'

export class EditPage extends Component {
    constructor(props) {
        super(props);
        this.colors = colors;

        this.editClicker = this.editClicker.bind(this);
        this.rmClicker = this.rmClicker.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(fetchCategories());
    }

    render() {
        return (
            <ul className="edit-category-list">
            {this.props.categories.list.map((item, index) =>
                <li data-id={item.id}>
                    <input type="text" className="form-title" defaultValue={item.title} ref={`title${item.id}`}/>
                    <ColorPicker datasource={this.colors} initValue={item.color} ref={`color${item.id}`}></ColorPicker>
                    <i className="fa fa-check" onClick={this.editClicker}></i>
                    <i className="fa fa-trash" onClick={this.rmClicker}></i>
                </li>
            )}
            </ul>
        );
    }

    editClicker(e) {
        let id = getIdByButton(e.target);
        let category = {
            id,
            title: this.refs[`title${id}`].value,
            color: this.refs[`color${id}`].state.value
        };

        if (category.title) {
            this.props.dispatch(submitEditCategory(category));
        }
    }

    rmClicker(e) {
        let id = getIdByButton(e.target);
        this.props.dispatch(submitRmCategory(id));
    }
}

function getIdByButton(el) {
    return +el.parentNode.getAttribute('data-id');
}

export default connect(function (state) {
    return {
        categories: state.categories
    };
})(EditPage)
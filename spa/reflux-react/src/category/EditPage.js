import React, {Component, PropTypes} from 'react'
import actions from './actions'
import store from './store'
import ColorPicker from '../component/ColorPicker'
import {colors} from '../config.js'

export default class EditPage extends Component {
    constructor(props) {
        super(props);

        this.colors = colors;
        this.state = {categories: store.getData()};

        this.editClicker = this.editClicker.bind(this);
        this.rmClicker = this.rmClicker.bind(this);
    }

    componentWillMount() {
        this.unsub = store.listen(categories => {
            this.onStateChange({categories});
        });
    }

    componentWillUnmount() {
        this.unsub();
    }

    onStateChange(nextState) {
        this.setState(nextState);
    }

    render() {
        return (
            <ul className="edit-category-list">
            {this.state.categories.map((item, index) =>
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
            actions.edit(category);
        }
    }

    rmClicker(e) {
        let id = getIdByButton(e.target);
        actions.rm(id);
    }
}

function getIdByButton(el) {
    return +el.parentNode.getAttribute('data-id');
}

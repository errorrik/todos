import React, {Component, PropTypes} from 'react'

export default class CategoryFilter extends Component {
    render() {
        let category = this.props.value;

        return (
            <ul className="filter-category">
            {this.props.datasource.map(item => 
                <li className={item.id == category ? 'checked' : ''}
                    style={{background: item.color}}
                >
                    <a href={`#/todos/category/${item.id}`}>{item.title}</a>
                </li>
            )}
            </ul>
        );
    }
}
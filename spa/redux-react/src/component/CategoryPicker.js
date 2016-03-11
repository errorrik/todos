import React, {Component, PropTypes} from 'react'

export default class CategoryPicker extends Component {
    constructor(props) {
        super(props);
        
        this.itemClick = this.itemClick.bind(this);
        this.state = {
            value: this.props.initValue
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.initValue
        });
    }

    render() {
        let category = this.props.value;

        return (
            <ul className="ui-categorypicker">
            {this.props.datasource.map((item, index) => 
                <li className={item.id == this.state.value ? 'selected' : ''}
                    style={{background: item.color}}
                    onClick={this.itemClick}
                    data-index={index}
                >
                    {item.title}
                </li>
            )}
            </ul>
        );
    }

    itemClick(e) {
        let index = +e.target.getAttribute('data-index');
        let item = this.props.datasource[index];
        let value = item && item.id;

        if (this.state.value != value) {
            this.setState({value});
        }
    }
}
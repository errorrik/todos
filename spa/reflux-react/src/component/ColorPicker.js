import React, {Component, PropTypes} from 'react'

export default class ColorPicker extends Component {
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
            <ul className="ui-colorpicker">
            {(this.props.datasource || []).map(item => 
                <li className={item == this.state.value ? 'selected' : ''}
                    style={{background: item}}
                    onClick={this.itemClick}
                    data-value={item}
                >
                </li>
            )}
            </ul>
        );
    }

    itemClick(e) {
        let value = e.target.getAttribute('data-value');

        if (this.state.value != value) {
            this.setState({value});
        }
    }
}
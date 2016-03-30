import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import TodoList from './todo/ListView.js'

class App extends Component {

    render() {
        return (
            <div>{this.props.children}</div>
        );
    }
}


function mapStateToProps(state) {
    return state;
}

export default connect(mapStateToProps)(App)


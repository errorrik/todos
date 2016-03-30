import Reflux from 'reflux'
import actions from './actions'


let todos = [];

let store = Reflux.createStore({
    listenables: actions,

    onListCompleted(data) {
        todos = data;
        this.trigger(todos);
    },

    onDoneCompleted(id) {
        todos.forEach(item => {
            if (item.id == id) {
                item.done = true;
            }
        });

        this.trigger(todos);
    },

    onRmCompleted(id) {
        todos = todos.filter(item => item.id != id);
        this.trigger(todos);
    },

    getData() {
        return todos;
    }
});

export default store;
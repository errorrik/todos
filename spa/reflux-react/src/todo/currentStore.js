import Reflux from 'reflux'
import actions from './actions'


let current;

let store = Reflux.createStore({
    listenables: actions,

    onItemCompleted(todo) {
        current = todo;
        this.trigger(todo);
    },

    onResetItem(todo) {
        current = todo;
        this.trigger(todo);
    },

    onAddCompleted(todo) {
        current = todo;
        current.requestCompleted = true;
        this.trigger(todo);
    },

    onEditCompleted(todo) {
        current = todo;
        current.requestCompleted = true;
        this.trigger(todo);
    },

    getData() {
        return current;
    }
});


actions.resetItem();

export default store;
import Reflux from 'reflux'
import actions from './actions'


let current;

let store = Reflux.createStore({
    listenables: actions,

    onResetItem(category) {
        current = category;
        this.trigger(current);
    },

    onAddCompleted(category) {
        current = Object.assign({}, category, {requestCompleted: true});
        this.trigger(current);
    },

    getData() {
        return current;
    }
});


actions.resetItem();

export default store;
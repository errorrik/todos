import Reflux from 'reflux'
import actions from './actions.js'


let categories = [];

let store = Reflux.createStore({
    listenables: actions,

    onListCompleted(data) {
        categories = data;
        this.trigger(categories);
    },

    onAddCompleted(category) {
        categories.push(category);
        this.trigger(categories);
    },

    onEditCompleted(category) {
        categories = categories.map(item => {
            if (item.id == category.id) {
                return category;
            }

            return item;
        });

        this.trigger(categories);
    },

    onRmCompleted(id) {
        categories = categories.filter(item => item.id != id);
        this.trigger(categories);
    },

    getData() {
        return categories;
    }
});

export default store;
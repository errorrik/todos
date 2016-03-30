import Reflux from 'reflux'
import * as service from '../service'

const actions = Reflux.createActions({
    list: {
        children: ['completed', 'failed']
    },

    resetItem: {
        sync: true,
        preEmit() {
            return {
                title: ''
            };
        }
    },

    add: {
        children: ['completed', 'failed']
    },

    edit: {
        children: ['completed', 'failed']
    },

    rm: {
        children: ['completed', 'failed']
    },
});


actions.list.listen(function () {
    service.categories()
        .then(this.completed)
        .catch(this.failed);
});

actions.add.listen(function (category) {
    service.addCategory(category)
        .then(this.completed)
        .catch(this.failed);
});

actions.edit.listen(function (category) {
    service.editCategory(category)
        .then(this.completed)
        .catch(this.failed);
});

actions.rm.listen(function (id) {
    service.rmCategory(id)
        .then(() => {this.completed(id)})
        .catch(this.failed);
});

export default actions;
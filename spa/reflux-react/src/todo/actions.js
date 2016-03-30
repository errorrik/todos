import Reflux from 'reflux'
import * as service from '../service'

const actions = Reflux.createActions({
    list: {
        children: ['completed', 'failed']
    },

    done: {
        children: ['completed', 'failed']
    },

    rm: {
        children: ['completed', 'failed']
    },

    item: {
        children: ['completed', 'failed']
    },

    resetItem: {
        sync: true,
        preEmit() {
            return newItem();
        }
    },

    add: {
        children: ['completed', 'failed']
    },

    edit: {
        children: ['completed', 'failed']
    }
});


actions.list.listen(function (category) {
    service.todos(category)
        .then(this.completed)
        .catch(this.failed);
});

actions.done.listen(function (id) {
    service.done(id)
        .then(() => {this.completed(id);})
        .catch(this.failed);
});

actions.rm.listen(function (id) {
    service.rm(id)
        .then(() => {this.completed(id);})
        .catch(this.failed);
});

actions.item.listen(function (id) {
    service.todo(id)
        .then(todo => cutTodoEndTime(todo))
        .then(this.completed)
        .catch(this.failed);
});

actions.add.listen(function (todo) {
    service.add(combineTodoEndTime(todo))
        .then(this.completed)
        .catch(this.failed);
});

actions.edit.listen(function (todo) {
    service.edit(combineTodoEndTime(todo))
        .then(this.completed)
        .catch(this.failed);
});

function newItem() {
    let now = new Date();
    now.setMinutes(0);
    now.setSeconds(0);

    return cutTodoEndTime({
        title: '',
        desc: '',
        endTime: now.getTime(),
        categoryId: null,
        done: false
    });
}

function cutTodoEndTime(todo) {
    if (todo.isFetching) {
        return todo;
    }

    let endTimeDate = new Date(todo.endTime);
    let endTimeHour = endTimeDate.getHours();
    endTimeDate.setHours(0);
    endTimeDate.setMinutes(0);
    endTimeDate.setSeconds(0);

    return Object.assign({}, todo, {
        endTimeDate,
        endTimeHour
    });
}

function combineTodoEndTime(todo) {
    let endTime = new Date(todo.endTimeDate.getTime());
    endTime.setHours(todo.endTimeHour);
    return Object.assign({}, todo, {endTime: endTime.getTime()});
}

export default actions;
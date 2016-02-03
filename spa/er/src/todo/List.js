define(function (require) {
    var Action = require('er/Action');

    function TodoAction() {
        Action.apply(this, arguments);
    }
    require('er/util').inherits(TodoAction, Action);

    TodoAction.prototype.modelType = require('./ListModel');
    TodoAction.prototype.viewType = require('./ListView');

    TodoAction.prototype.initBehavior = function () {
        this.view.on('rm', rmTodo.bind(this));
        this.view.on('done', doneTodo.bind(this));
    };

    function rmTodo(e) {
        var id = e.data;
        var view = this.view;
        this.model.rmTodo(id).then(function () {
            view.rmTodo(id);
        });
    }

    function doneTodo(e) {
        var id = e.data;
        var view = this.view;
        this.model.doneTodo(id).then(function () {
            view.doneTodo(id);
        });
    }

    return TodoAction;
});
define(function (require) {
    require('er/tpl!./list.tpl.html');
    require('esui/Panel');
    require('esui/extension/Command');

    var View = require('er/View');

    function TodoView() {
        View.apply(this, arguments);
    }
    require('er/util').inherits(TodoView, View);

    TodoView.prototype.template = 'todo/list';

    TodoView.prototype.uiEvents = {
        'todo-list:command': function (e) {
            this.fire(e.name, e.args);
        }
    };

    TodoView.prototype.rmTodo = function (id) {
        this.getSafely('todo-item-' + id).destroy();
    };

    TodoView.prototype.doneTodo = function (id) {
        this.getSafely('todo-item-' + id).addState('done');
    };

    return TodoView;
});

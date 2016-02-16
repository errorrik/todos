define(function (require) {
    require('er/tpl!./list.tpl.html');
    require('esui/Panel');
    require('esui/extension/Command');

    var UIView = require('ef/UIView');

    function TodoView() {
        UIView.apply(this, arguments);
    }
    require('er/util').inherits(TodoView, UIView);

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
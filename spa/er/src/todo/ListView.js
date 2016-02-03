define(function (require) {
    require('er/tpl!./list.tpl.html');

    var View = require('er/View');

    function TodoView() {
        View.apply(this, arguments);
    }
    require('er/util').inherits(TodoView, View);

    TodoView.prototype.template = 'todo/list';

    TodoView.prototype.enterDocument = function () {
        this.clickListener = getClickListener(this);
        this.getContainerElement().addEventListener('click', this.clickListener, false);
    };

    TodoView.prototype.dispose = function () {
        if (this.clickListener) {
            this.getContainerElement().removeEventListener('click', this.clickListener, false);
            this.clickListener = null;
        }

        View.prototype.dispose.call(this);
    };

    TodoView.prototype.rmTodo = function (id) {
        eachTodoElement(function (li) {
            var itemId = li.getAttribute('data-todo-id');
            if (id == itemId) {
                li.parentNode.removeChild(li);
                return false;
            }
        });
    };

    TodoView.prototype.doneTodo = function (id) {
        eachTodoElement(function (li) {
            var itemId = li.getAttribute('data-todo-id');
            if (id == itemId) {
                li.className = 'todo-done';
                return false;
            }
        });
    };

    function eachTodoElement(iterator) {
        var lis = document.getElementById('todo-list').getElementsByTagName('li');
        for (var i = 0, l = lis.length; i < l; i++) {
            if (iterator(lis[i]) === false) {
                break;
            }
        }
    }

    function getClickListener(view) {
        return function (e) {
            e = e || window.event;
            var target = e.target || e.srcElement;
            var cmd = target.getAttribute('data-cmd');
            if (cmd) {
                view.fire(cmd, target.getAttribute('data-cmd-args'));
            }
        };
    }

    return TodoView;
});
define(function (require) {
    var Model = require('er/Model');
    var moment = require('moment');
    var service = require('../service');

    function TodoModel() {
        Model.apply(this, arguments);

        this.datasource = {
            list: function (model) {
                return service.todos(model.get('category'));
            },

            categories: function (model) {
                return service.categories();
            }
        };
    }
    require('er/util').inherits(TodoModel, Model);

    TodoModel.prototype.prepare = function () {
        var list = this.get('list');

        list.forEach(function (item) {
            item.endTimeText = moment(item.endTime).format('YYYY-MM-DD, h:mm a');
        });
    };

    TodoModel.prototype.rmTodo = function (id) {
        var list = this.get('list');
        return service.rm(id).then(function () {
            var len = list.length;
            while (len--) {
                if (list[len].id == id) {
                    list.splice(len, 1);
                    break;
                }
            }
        });
    };

    TodoModel.prototype.doneTodo = function (id) {
        var list = this.get('list');
        return service.done(id).then(function () {
            var len = list.length;
            while (len--) {
                if (list[len].id == id) {
                    list[len].done = true;
                    break;
                }
            }
        });
    };

    return TodoModel;
});

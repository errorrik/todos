define(function(require) {
    var Controller = require('../Controller');
    var Backbone = require('Backbone');
    var service = require('../service');

    function List() {
        Controller.apply(this, arguments);
    }
    Controller.derive(List);

    List.prototype.routes = [
        'todos/category/:id', 
        'todos',
        ''
    ];

    List.prototype.name = 'todo/list';

    List.prototype.initModel = function () {
        var categoryId = this.query[0];

        return Promise.all([service.todos(categoryId), service.categories()])
            .then(function (data) {
                var ListCollection = require('./ListCollection');

                var todos = new ListCollection(data[0]);
                var categories = data[1];
                return new Backbone.Model({
                    todos: todos,
                    categories: categories,
                    category: categoryId
                });
            });
    };

    List.prototype.initView = function () {
        var ListView = require('./ListView');
        var view = new ListView({model: this.model});
        return view;
    };

    return List;
});
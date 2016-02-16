define(function(require) {
    var Controller = require('../Controller');
    var Backbone = require('Backbone');
    var service = require('../service');
    var Layer = require('../ui/Layer');

    function Form() {
        Controller.apply(this, arguments);
    }
    Controller.derive(Form);

    Form.prototype.initView = function () {
        var View = require('./FormView');
        var view = new View({model: this.model});
        return view;
    };

    Form.prototype.initModel = function () {
        return Promise.all([this.queryTodo(), service.categories()])
            .then(function (data) {
                var todo = data[0];
                todo.categories = data[1];
                todo.category = todo.category || null;

                var ItemModel = require('./ItemModel');
                return new ItemModel(todo);
            });
    };

    Form.prototype.queryTodo = function () {
        return Promise.resolve({
            title: '',
            desc: '',
            category: null
        });
    };

    Form.prototype.after = function () {
        this.listenTo(Backbone, 'addCategory', this.reloadCategories);
        this.listenTo(Backbone, 'editCategory', this.reloadCategories);
        this.listenTo(Backbone, 'rmCategory', this.reloadCategories);
        this.listenTo(this.view, 'addCategory', this.startAddCategory);
        this.listenTo(this.view, 'editCategory', this.startEditCategory);
        this.listenTo(this.view, 'ok', this.sendData);
        this.listenTo(this.view, 'cancel', this.back);
    };

    Form.prototype.startAddCategory = function () {
        var layer = this.view.childs.addCategoryLayer;
        if (!layer) {
            layer = new Layer({className: 'add-category-layer'});
            layer.$el.width(200);
            layer.render();
            this.view.childs.addCategoryLayer = layer;

            var AddCategoryController = require('../category/Add');
            var controller = new AddCategoryController({
                el: layer.el
            });
            this.listenTo(controller, 'done', this.hideLayers);
            this.childs.addCategory = controller;
        }

        layer.show({
            top: 100,
            left: window.screen.availWidth / 2 - 100
        });
    };

    Form.prototype.startEditCategory = function () {
        var layer = this.view.childs.editCategoryLayer;
        if (!layer) {
            layer = new Layer({className: 'edit-category-layer'});
            layer.$el.width(200);
            layer.render();
            this.view.childs.editCategoryLayer = layer;

            var closeBtn = $('<i class="fa fa-times-circle-o" data-command="hide"></i>');
            layer.$el.append(closeBtn);
            this.listenTo(layer, 'command', this.hideLayers);

            var EditCategoryController = require('../category/Edit');
            var controller = new EditCategoryController({
                el: layer.el
            });
            this.childs.editCategory = controller;
        }

        layer.show({
            top: 100,
            left: window.screen.availWidth / 2 - 100
        });
    };

    Form.prototype.reloadCategories = function () {
        var model = this.model;

        service.categories().then(function (categories) {
            model.set('categories', categories);
        });
    };

    Form.prototype.hideLayers = function (e) {
        var layer = this.view.childs.addCategoryLayer;
        if (layer) {
            layer.hide();
        }

        layer = this.view.childs.editCategoryLayer;
        if (layer) {
            layer.hide();
        }

        e.returnValue = false;
    };

    Form.prototype.dataSended = function () {
        this.back();
    };

    Form.prototype.back = function () {
        history.back();
    };

    Form.prototype.sendData = function () {};

    return Form;
});
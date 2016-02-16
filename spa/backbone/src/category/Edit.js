define(function(require) {
    var Controller = require('../Controller');
    var Backbone = require('Backbone');
    var service = require('../service');

    function Edit() {
        Controller.apply(this, arguments);
    }
    Controller.derive(Edit);

    Edit.prototype.initView = function () {
        var View = require('./EditView');
        var view = new View({model: this.model});

        this.listenTo(view, 'rmItem', this.rmItem);
        this.listenTo(view, 'editItem', this.editItem);
        return view;
    };

    Edit.prototype.initModel = function () {
        return service.categories()
            .then(function (categories) {
                return new Backbone.Model({
                    categories: new Backbone.Collection(categories)
                })
            });
    };

    Edit.prototype.rmItem = function (itemModel) {
        service.rmCategory(itemModel.get('id')).then(this.rmFinished.bind(this, itemModel));
    };

    Edit.prototype.rmFinished = function (itemModel) {
        var id = itemModel.get('id');
        this.model.get('categories').remove(itemModel);
        Backbone.trigger('rmCategory', id);
    };

    Edit.prototype.editItem = function (itemModel) {
        var category = {
            id: itemModel.get('id'), 
            title: itemModel.get('title'),
            color: itemModel.get('color')
        };

        service.editCategory(category).then(function () {
            Backbone.trigger('editCategory', category);
        });
    };

    return Edit;
});
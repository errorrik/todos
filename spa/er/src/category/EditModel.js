define(function (require) {
    var UIModel = require('ef/UIModel');
    var datasource = require('er/datasource');
    var common = require('../common');
    var service = require('../service');

    function EditModel() {
        UIModel.apply(this, arguments);

        this.datasource = {
            categories: function (model) {
                return service.categories();
            }
        };
    }
    require('er/util').inherits(EditModel, UIModel);

    EditModel.prototype.prepare = function () {
        this.set('colors', require('./colors'));
    };

    EditModel.prototype.edit = function (category) {
        var categories = this.get('categories');
        return service.editCategory(category).then(function () {
            var len = categories.length;
            while (len--) {
                if (categories[len].id == category.id) {
                    categories[len] = category;
                    break;
                }
            }
        });
    };

    EditModel.prototype.rm = function (id) {
        var categories = this.get('categories');
        return service.rmCategory(id).then(function () {
            var len = categories.length;
            while (len--) {
                if (categories[len].id == id) {
                    categories.splice(len, 1);
                    break;
                }
            }
        });
    };

    return EditModel;
});
define(function (require) {
    var Model = require('er/Model');
    var service = require('../service');


    function AddModel() {
        Model.apply(this, arguments);
    }
    require('er/util').inherits(AddModel, Model);

    AddModel.prototype.prepare = function () {
        this.set('colors', require('./colors'));
    };

    AddModel.prototype.sendData = function (category) {
        return service.addCategory(category);
    };

    return AddModel;
});
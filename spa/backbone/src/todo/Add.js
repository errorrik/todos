define(function(require) {
    var Form = require('./Form');
    var service = require('../service');

    function Add() {
        Form.apply(this, arguments);
    }
    Form.derive(Add);

    Add.prototype.routes = ['add'];
    Add.prototype.name = 'todo/add';


    Add.prototype.sendData = function (data) {
        service.add(data).then(this.dataSended.bind(this));
    };

    return Add;
});
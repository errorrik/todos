define(function(require) {
    var Form = require('./Form');
    var service = require('../service');

    function Edit() {
        Form.apply(this, arguments);
    }
    Form.derive(Edit);

    Edit.prototype.routes = ['edit/:id'];
    Edit.prototype.name = 'todo/edit';

    Edit.prototype.queryTodo = function () {
        return service.todo(this.query[0]);
    };

    Edit.prototype.sendData = function (data) {
        service.edit(data).then(this.dataSended.bind(this));
    };

    return Edit;
});
define(function (require) {
    var Action = require('er/Action');

    function EditAction() {
        Action.apply(this, arguments);
    }
    require('er/util').inherits(EditAction, Action);

    EditAction.prototype.modelType = require('./EditModel');
    EditAction.prototype.viewType = require('./EditView');

    EditAction.prototype.initBehavior = function () {
        this.view.on('edit', edit.bind(this));
        this.view.on('rm', rm.bind(this));
    };

    function edit(e) {
        var action = this;
        this.model.edit(e).then(function () {
            action.fire('change');
        });
    }

    function rm(e) {
        var action = this;
        this.model.rm(e.id).then(function () {
            action.fire('change');
            e.target.rm(e.id);
        });
    }


    return EditAction;
});
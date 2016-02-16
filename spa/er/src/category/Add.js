define(function (require) {
    var Action = require('er/Action');

    function AddAction() {
        Action.apply(this, arguments);
    }
    require('er/util').inherits(AddAction, Action);

    AddAction.prototype.modelType = require('./AddModel');
    AddAction.prototype.viewType = require('./AddView');

    AddAction.prototype.initBehavior = function () {
        this.view.on('submit', submitData, this);
        this.view.on('cancel', cancel, this);
    };

    function submitData(category) {
        this.model.sendData(category).then(dataSended.bind(this));
    }

    function cancel() {
        this.fire('cancel');
    }

    function dataSended() {
        this.fire('done');
    }

    return AddAction;
});

define(function (require) {
    var Action = require('er/Action');

    function AddAction() {
        Action.apply(this, arguments);
    }
    require('er/util').inherits(AddAction, Action);

    AddAction.prototype.modelType = require('./AddModel');
    AddAction.prototype.viewType = require('./AddView');

    AddAction.prototype.initBehavior = function () {
        this.view.on('submit', submitData.bind(this));
        this.view.on('cancel', cancel.bind(this));
    };

    function submitData(category) {
        console.log(category)
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

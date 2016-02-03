define(function (require) {
    var Action = require('er/Action');

    function FormAction() {
        Action.apply(this, arguments);
    }
    require('er/util').inherits(FormAction, Action);

    FormAction.prototype.modelType = require('./FormModel');
    FormAction.prototype.viewType = require('./FormView');

    FormAction.prototype.initBehavior = function () {
        this.view.on('submit', submitData, this);
        this.view.on('categoryChange', updateCategory, this);
    };

    function submitData(todo) {
        this.model.sendData(todo).then(function () {
            history.back();
        });
    }

    function updateCategory() {
        this.model.refreshCategories().then(this.view.updateCategory.bind(this.view));
    }

    return FormAction;
});

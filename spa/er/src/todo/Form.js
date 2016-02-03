define(function (require) {
    var Action = require('er/Action');

    function FormAction() {
        Action.apply(this, arguments);
    }
    require('er/util').inherits(FormAction, Action);

    FormAction.prototype.modelType = require('./FormModel');
    FormAction.prototype.viewType = require('./FormView');

    FormAction.prototype.initBehavior = function () {
        this.view.on('submit', submitData.bind(this));
        this.view.on('categoryChange', updateCategory.bind(this));
    };

    function submitData(todo) {
        this.model.sendData(todo).then(function () {
            history.back();
        });
    }

    function updateCategory() {
        this.model.refreshCategories().then(updateCategoryDone.bind(this));
    }

    function updateCategoryDone() {
        this.view.updateCategory(this.model.get('categories'));
    }

    return FormAction;
});
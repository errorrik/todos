define(function (require) {
    require('er/tpl!./form.tpl.html');
    require('esui/TextBox');
    require('esui/Calendar');
    require('esui/Button');
    require('esui/Select');
    require('ef/ActionDialog')
    require('../ui/CategoryPicker');

    var UIView = require('ef/UIView');

    function FormView() {
        UIView.apply(this, arguments);
    }
    require('er/util').inherits(FormView, UIView);

    FormView.prototype.template = 'todo/form';

    FormView.prototype.uiProperties = {
        title: {
            value: '@title'
        },

        desc: {
            value: '@desc'
        },

        endTimeD: {
            rawValue: '@endTime'
        },

        endTimeT: {
            datasource: '@dateTimes',
            value: '@endTimeT'
        },

        category: {
            datasource: '@categories',
            value: '@categoryId'
        }
    };

    FormView.prototype.uiEvents = {
        cancel: {
            click: function () {
                history.back();
            }
        },

        ok: {
            click: function () {
                var title = this.get('title').getValue();

                if (!title) {
                    return;
                }

                var desc = this.get('desc').getValue();
                var category = this.get('category').getValue();
                var endTime = this.get('endTimeD').getRawValue();
                var endTimeT = this.get('endTimeT').getValue();
                endTime.setHours(endTimeT);

                this.fire('submit', {
                    title: title,
                    desc: desc,
                    endTime: endTime.getTime(),
                    categoryId: category
                });
            }
        },

        addCategory: {
            click: function () {
                var addCategoryDialog = this.get('addCategoryDialog');
                if (!addCategoryDialog) {
                    var div = document.createElement('div');
                    document.body.appendChild(div);

                    addCategoryDialog = this.create('ActionDialog', {
                        url: '/category/add',
                        id: 'addCategoryDialog',
                        title: '添加分类',
                        main: div,
                        needFoot: false,
                        draggable: true,
                        width: 300,
                        mask: true,
                        viewContext: this.viewContext
                    });
                    addCategoryDialog.render();
                    addCategoryDialog.on('action@done', this.fireCategoryChange.bind(this));
                    addCategoryDialog.on('action@cancel', this.closeAddCategoryDialog.bind(this));
                }

                addCategoryDialog.show();
            }
        },

        editCategory: {
            click: function () {
                var editCategoryDialog = this.get('editCategoryDialog');
                if (!editCategoryDialog) {
                    var div = document.createElement('div');
                    document.body.appendChild(div);

                    editCategoryDialog = this.create('ActionDialog', {
                        url: '/category/edit',
                        id: 'editCategoryDialog',
                        title: '修改分类',
                        main: div,
                        needFoot: false,
                        draggable: true,
                        width: 300,
                        mask: true,
                        viewContext: this.viewContext
                    });
                    editCategoryDialog.render();
                    editCategoryDialog.on('action@change', this.fireCategoryChange.bind(this));
                }

                editCategoryDialog.show();
            }
        }
    };

    FormView.prototype.closeAddCategoryDialog = function () {
        this.get('addCategoryDialog').hide();
    };

    FormView.prototype.fireCategoryChange = function (e) {
        console.log(e)
        this.fire('categoryChange');
    };

    FormView.prototype.enterDocument = function () {
        UIView.prototype.enterDocument.call(this);
    };

    FormView.prototype.updateCategory = function (datasource) {
        var category = this.get('category');
        category.set('datasource', datasource);

        var addCategoryDialog = this.get('addCategoryDialog');
        if (addCategoryDialog) {
            addCategoryDialog.dispose();
        }
    };

    return FormView;
});
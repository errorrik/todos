/**
 * @file 添加Todo模块
 * @author errorrik
 */


define(function (require) {
    var service = require('./service');
    var CategoryComponent = require('./components/category');
    var ColorPicker = require('./components/color-picker');

    var tplHead = '<input type="text" id="form-title" placeholder="标题">'
        + '<textarea id="form-desc" placeholder="备注"></textarea>';
    var tplFoot = '<div id="add-category-form" title="Add Category">'
        + '<input type="text" id="add-category-title" placeholder="分类">'
        + '<ul id="add-category-color"></ul>'
        + '</div>'
        + '<div id="edit-category-form" title="Edit Category">'
        + '<ul id="edit-category-list"></ul></div>'
        + '<i id="add-category" class="fa fa-plus"></i>'
        + '<i id="edit-category" class="fa fa-pencil"></i>'
        + '<div>预期完成时间： <input type="text" id="endTime-date"><input type="text" id="endTime-time"></div>'
        + '<div class="form-op"><button type="button" id="btn-ok"><i class="fa fa-check-circle-o"></i></button>'
        + '<button type="button" id="btn-cancel"><i class="fa fa-times-circle-o"></i></button></div>';


    function FormAction(option) {
        this.url = option.url;
        this.params = option.params;
        this.referrer = option.referrer;

        this.mode = this.url.indexOf('add') >= 0 ? 'add' : 'edit';
        this.wrap = '#wrap';
        this.init();
    }

    FormAction.prototype.init = function () {
        var me = this;
        service.categories()
            .then(function (categories) {
                me.render(categories);
                if (me.mode === 'edit') {
                    return service.todo(me.params[1]);
                }
                else {
                    var endTime = new Date();
                    endTime.setDate(endTime.getDate() + 1);
                    endTime.setSeconds(0);
                    endTime.setMinutes(0);
                    return {
                        endTime: endTime.getTime()
                    };
                }
            })
            .then(function (value) {
                me.setValue(value);
            });
    };

    FormAction.prototype.render = function (categories) {
        var html = '<div id="form">' + tplHead + '<ul id="form-category"></ul>' 
            + tplFoot + '</div>';

        
        $(this.wrap).html(html);
        

        $('#endTime-time').timepicker({ 'step': 60 });
        $('#endTime-date').datepicker({
            dateFormat: 'yy-mm-dd'
        });
        

        $('#btn-cancel').click(this.backward.bind(this));
        $('#btn-ok').click(this.submit.bind(this));

        
        if (!this.addCategoryColor) {
            this.addCategoryColor = new ColorPicker({
                main: document.getElementById('add-category-color')
            });
            this.addCategoryColor.render();
        }

        var me = this;
        $('#add-category-form').dialog({
            autoOpen: false,
            width: 200,
            buttons: {
                OK: function() {
                    var okBtn = $(this);
                    service.addCategory({
                        title: $('#add-category-title').val(),
                        color: me.addCategoryColor.getSelected()
                    })
                    .then(function () {
                        return service.categories();
                    })
                    .then(function (categories) {
                        okBtn.dialog("close");
                        me.categoryComponent.setData(categories);
                    });
                },
                Cancel: function() {
                    $(this).dialog("close");
                }
            }
        });
        $('#edit-category-form').dialog({
            autoOpen: false,
            width: 200
        });
        $('#add-category').click(this.startAddCategory.bind(this));
        $('#edit-category').click(this.startEditCategory.bind(this));

        this.renderCategories(categories);
        $('#edit-category-list')
            .delegate('i', 'click', function () {
                var cmd = this.getAttribute('data-cmd');
                var li = this.parentNode;
                var id = li.getAttribute('data-id');
                var idx = parseInt(li.getAttribute('data-index'), 10);
                var opPromise;
                switch (cmd) {
                    case 'rm':
                        opPromise = service.rmCategory(id);
                        break;
                    case 'edit':
                        opPromise = service.editCategory({
                            id: id,
                            title: li.firstChild.value,
                            color: me.editCategoriesColors[idx].getSelected()
                        });
                        break;
                }

                opPromise.then(function () {
                    return service.categories();
                })
                .then(function (categories) {
                    me.renderCategories(categories);
                });
                
            });
    };

    FormAction.prototype.renderCategories = function (categories) {
        if (!this.categoryComponent) {
            this.categoryComponent = new CategoryComponent({
                main: document.getElementById('form-category'),
                data: categories
            });
            this.categoryComponent.render();
        }
        else {
            this.categoryComponent.setData(categories);
        }

        var html = '';
        for (var i = 0; i < categories.length; i++) {
            var category = categories[i];
            // 试验项目，不做转义了
            html += '<li data-index="' + i + '" data-id="' + category.id 
                + '"><input type="text" value="' + category.title 
                + '"><ul></ul><i class="fa fa-check" data-cmd="edit"></i><i class="fa fa-trash" data-cmd="rm"></i></li>';
        }

        // dispose
        if (this.editCategoriesColors) {
            var len = this.editCategoriesColors.length;
            while (len--) {
                this.editCategoriesColors[len].dispose();
            }
            this.editCategoriesColors.length = 0;
        }

        var wrap = document.getElementById('edit-category-list');
        wrap.innerHTML = html;
        var uls = wrap.getElementsByTagName('ul');
        var len = uls.length;
        this.editCategoriesColors = [];
        while (len--) {
            var colorPicker = new ColorPicker({
                main: uls[len]
            });
            colorPicker.render();
            colorPicker.setSelected(categories[len].color);
            this.editCategoriesColors[len] = colorPicker;
        }
    };

    FormAction.prototype.startAddCategory = function () {
        $('#add-category-form').dialog("open");
    };

    FormAction.prototype.startEditCategory = function () {
        $('#edit-category-form').dialog("open");
    };

    FormAction.prototype.backward = function () {
        location.hash = this.referrer;
    };
    
    FormAction.prototype.submit = function () {
        var time = $('#endTime-time').timepicker('getTime');
        var date = $('#endTime-date').datepicker('getDate');
        var endTime = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            time.getHours(),
            time.getMinutes(),
            0
        );

        var todo = {
            title: $('#form-title').val(),
            desc: $('#form-desc').val(),
            endTime: endTime.getTime(),
            categoryId: this.categoryComponent.getSelected()
        };

        if (this.mode === 'edit') {
            todo.id = this.params[1];
            service.edit(todo).then(this.backward.bind(this));
        }
        else {
            service.add(todo).then(this.backward.bind(this));
        }
    };

    FormAction.prototype.setValue = function (value) {
        $('#form-title').val(value.title || '');
        $('#form-desc').val(value.desc || '');
        var endTime = new Date(value.endTime);
        $('#endTime-time').timepicker('setTime', endTime);
        $('#endTime-date').datepicker('setDate', endTime);

        this.categoryComponent.setSelected(value.categoryId);
    };


    FormAction.prototype.dispose = function () {
        $(this.wrap).html('');
    };

    return FormAction;
});

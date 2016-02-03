/**
 * @file Todo列表模块
 * @author errorrik
 */

define(function (require) {
    var service = require('./service');
    var moment = require('moment');
    var CategoryComponent = require('./components/category');

    function ListAction(option) {
        this.url = option.url;
        this.params = option.params;
        if (option.params) {
            this.categoryId = option.params[1];
        }

        this.mode = this.url.indexOf('category') >= 0 ? 'category' : 'list';
        this.wrap = '#wrap';
        this.init();
    }

    ListAction.prototype.init = function () {
        var me = this;
        Promise.all([service.todos(me.categoryId), service.categories()])
            .then(function (value) {
                me.render({
                    list: value[0],
                    categories: value[1]
                });
            });
    };

    /**
     * 初始化列表视图
     *
     * @inner
     * @param {Array} list 列表数据
     */
    ListAction.prototype.render = function (data) {
        var list = data.list;
        var categories = data.categories;
        var html = '<a href="#/add" id="add"><i class="fa fa-plus-square"></i></a>';
        html += '<ul id="filter-category"></ul>'
        if (this.mode === 'category') {
            html += '<a href="#/" class="fa fa-close filter-category-clear"></a>'
        }
        html += '<ul id="todo-list">';
        list.forEach(function (item) {
            var category = item.category;
            html += '<li data-todo-id="' + item.id + '"'
                + (item.done ? ' class="done"' : '')
                + (category ? ' style="border-color:' + category.color + '"' : '')
                + '>' + genItemHTML(item) + '</li>';
        });
        html += '</ul>';

        $(this.wrap).html(html)
            .delegate('i', 'click', function (e) {
                var target = e.target;
                var li = target.parentNode;
                var id = li.getAttribute('data-todo-id');
                var cmd = target.getAttribute('data-cmd');

                switch (cmd) {
                    case 'rm':
                        service.rm(id);
                        $(li).remove();
                        break;
                    case 'done':
                        service.done(id);
                        li.className = 'done';
                        break;
                }
            });

        this.renderCategory(categories);
    };

    ListAction.prototype.renderCategory = function (categories) {
        if (!this.categoryComponent) {
            this.categoryComponent = new CategoryComponent({
                main: document.getElementById('filter-category'),
                data: categories
            });
            this.categoryComponent.itemTpl = '<a href="#/category/{id}">{title}</a>';
            this.categoryComponent.render();
            this.categoryComponent.setSelected(this.categoryId);
        }
    };

    ListAction.prototype.dispose = function () {
        $(this.wrap).html('');
    };

    /**
     * 生成Todo项的HTML
     *
     * @inner
     * @param {Object} item Todo项数据
     * @return {string}
     */
    function genItemHTML(item) {
        return '<h3>' + item.title + '</h3>'
            + '<p>' + (item.desc || 'no description') + '</p>'
            + '<div class="todo-meta">'
            + (item.category ? '<span>' + item.category.title + '</span> | ' : '')
            + '<span>预期完成时间: ' + moment(item.endTime).format('YYYY-MM-DD, h:mm a') + '</span>'
            + '</div>'
            + '<a class="fa fa-pencil" href="#/edit/' + item.id + '"></a>'
            + '<i class="fa fa-check" data-cmd="done"></i>'
            + '<i class="fa fa-trash-o" data-cmd="rm"></i>';
    }

    return ListAction;
});

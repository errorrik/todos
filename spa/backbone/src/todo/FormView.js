define(function (require) {
    var Backbone = require('Backbone');
    var _ = require('underscore');

    var CategoryPicker = require('../ui/CategoryPicker');
    var TimePicker = require('../ui/TimePicker');
    var Calendar = require('../ui/Calendar');

    return Backbone.View.extend({
        template: _.template($('#view-todo-form').html()),
        events: {
            'click .form-cancel': 'onCancel',
            'click .form-ok': 'onOK',
            'blur .form-title': 'onTitleFinished',
            'blur .form-desc': 'onDescFinished',
            'click .add-category': 'onAddCategory',
            'click .edit-category': 'onEditCategory'
        },

        render: function () {
            var html = this.template(this.model.toJSON());
            this.$el.html(html);

            this.renderCategoryPicker();
            this.renderTimePicker();
            this.renderDatePicker();

            return this;
        },

        renderCategoryPicker: function () {
            var categoryPicker = new CategoryPicker({
                el: '.form-category-picker',
                model: new Backbone.Model({
                    datasource: this.model.get('categories'),
                    value: this.model.get('categoryId'),
                })
            });
            this.childs.categoryPicker = categoryPicker;
            categoryPicker.render();
            this.listenTo(this.model, 'change:categories', this.refreshCategoryPicker);
            this.listenTo(categoryPicker, 'change', this.selectCategory);
        },

        refreshCategoryPicker: function (categories) {
            this.childs.categoryPicker.model = new Backbone.Model({
                datasource: this.model.get('categories'),
                value: this.model.get('categoryId'),
            });
            this.childs.categoryPicker.render();
        },

        renderTimePicker: function () {
            var timePicker = new TimePicker({
                el: '.form-endtime-time',
                model: new Backbone.Model({
                    value: this.model.get('endTime-time'),
                })
            });
            this.childs.timePicker = timePicker;
            timePicker.render();
            this.listenTo(timePicker, 'change', this.selectTime);
        },

        renderDatePicker: function () {
            var datePicker = new Calendar({
                el: '.form-endtime-date',
                model: new Backbone.Model({
                    value: this.model.get('endTime')
                })
            });
            this.childs.datePicker = datePicker;
            datePicker.render();
            this.listenTo(datePicker, 'change', this.selectDate);
        },

        onTitleFinished: function (e) {
            this.model.set('title', e.target.value);
        },

        onDescFinished: function (e) {
            this.model.set('desc', e.target.value);
        },

        onCancel: function () {
            this.trigger('cancel');
        },

        onOK: function () {
            var title = this.model.get('title');
            if (!title) {
                return;
            }

            var arg = {
                title: title,
                desc: this.model.get('desc'),
                categoryId: this.model.get('categoryId'),
                endTime: this.model.get('endTime').getTime()
            };

            var id = this.model.get('id');
            if (id) {
                arg.id = id;
            }

            this.trigger('ok', arg);
        },

        onAddCategory: function () {
            this.trigger('addCategory');
        },

        onEditCategory: function () {
            this.trigger('editCategory');
        },

        selectCategory: function (categoryId) {
            this.model.set('categoryId', categoryId);
        },

        selectTime: function (time) {
            time = +time;
            this.model.set('endTime-time', time);
            this.model.get('endTime').setHours(time);
        },

        selectDate: function (date) {
            var endTime = this.model.get('endTime');
            endTime.setFullYear(date.getFullYear());
            endTime.setMonth(date.getMonth());
            endTime.setDate(date.getDate());
        }
    });
});
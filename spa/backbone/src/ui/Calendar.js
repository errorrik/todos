define(function (require) {
    var Backbone = require('Backbone');
    var $ = require('jquery');
    var _ = require('underscore');
    var Layer = require('./Layer');
    var moment = require('moment');

    return Backbone.View.extend({
        initialize: function () {
            var value = this.model.get('value');
            if (!value) {
                value = new Date();
                this.model.set('value', value);
            }

            this.setViewDate(value);
            this.model.set('dayTexts', ['一', '二', '三', '四', '五', '六', '日']);
        },

        template: _.template($('#view-ui-calendar').html()),
        events: {
            'click': 'onElClick'
        },

        render: function () {
            this.layer = new Layer({
                className: 'ui-calendar'
            });
            this.layer.render();
            this.listenTo(this.layer, 'command', this.onCommand);
            this.refreshView();

            $(document).on('click', this.onBodyClick.bind(this));
        },

        onElClick: function () {
            this.layer.showBeside(this.$el);
        },

        onBodyClick: function (e){
            var target = $(e.target);
            var input = target.closest(this.el);
            if (input.length === 0) {
                this.layer.hide();
            }
        },

        onCommand: function (e) {
            switch (e.name) {
                case 'prev-month':
                    this.prevMonth();
                    break;

                case 'next-month':
                    this.nextMonth();
                    break;

                case 'select':
                    var target = e.event.target;
                    var date = new Date(
                        parseInt(target.getAttribute('data-year', 10)),
                        parseInt(target.getAttribute('data-month', 10)),
                        parseInt(target.getAttribute('data-date', 10))
                    );
                    this.select(date);
                    this.layer.hide();
            }
        },

        select: function (date) {
            this.model.set('value', date);
            this.trigger('change', date);
            this.refreshView();
        },

        prevMonth: function () {
            var viewDate = this.model.get('viewDate');
            viewDate.setMonth(viewDate.getMonth() - 1);
            this.setViewDate(viewDate);
            this.refreshView();
        },

        nextMonth: function () {
            var viewDate = this.model.get('viewDate');
            viewDate.setMonth(viewDate.getMonth() + 1);
            this.setViewDate(viewDate);
            this.refreshView();
        },

        refreshView: function () {
            this.layer.$el.html(this.template(this.model.toJSON()));
            this.el.value = this.getValueText(this.model.get('value'));
        },

        setViewDate: function (viewDate) {
            viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
            this.model.set('viewDate', viewDate);

            var year = viewDate.getFullYear();
            var month = viewDate.getMonth();
            this.model.set('viewYear', year);
            this.model.set('viewMonth', month);

            var monthDays = [];
            this.model.set('monthDays', monthDays);

            var day = viewDate.getDay() - 1;
            for (; day % 7; day--) {
                monthDays.push(0);
            }
            
            var nextMonth = new Date(year, month + 1, 1);
            var days = (nextMonth - viewDate) / 24 / 60 / 60 / 1000;
            for (var i = 1; i <= days; i++) {
                monthDays.push(i);
            }
            
            nextMonth.setDate(0);
            day = nextMonth.getDay() || 7;
            for (; day < 7; day++) {
                monthDays.push(0);
            }
        },

        getValueText: function (value) {
            return moment(value).format('YYYY-MM-DD');
        }
    });
});
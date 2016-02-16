define(function (require) {
    var Backbone = require('Backbone');
    var $ = require('jquery');
    var _ = require('underscore');
    var Layer = require('./Layer');

    return Backbone.View.extend({
        initialize: function () {
            this.model.set('datasource', [
                {text: '12:00am', value: 0},
                {text: '1:00am', value: 1},
                {text: '2:00am', value: 2},
                {text: '3:00am', value: 3},
                {text: '4:00am', value: 4},
                {text: '5:00am', value: 5},
                {text: '6:00am', value: 6},
                {text: '7:00am', value: 7},
                {text: '8:00am', value: 8},
                {text: '9:00am', value: 9},
                {text: '10:00am', value: 10},
                {text: '11:00am', value: 11},
                {text: '12:00pm', value: 12},
                {text: '1:00pm', value: 13},
                {text: '2:00pm', value: 14},
                {text: '3:00pm', value: 15},
                {text: '4:00pm', value: 16},
                {text: '5:00pm', value: 17},
                {text: '6:00pm', value: 18},
                {text: '7:00pm', value: 19},
                {text: '8:00pm', value: 20},
                {text: '9:00pm', value: 21},
                {text: '10:00pm', value: 22},
                {text: '11:00pm', value: 23}
            ]);
        },

        template: _.template($('#view-ui-timepicker').html()),
        events: {
            'click': 'onElClick'
        },

        render: function () {
            this.layer = new Layer({className: 'ui-timepicker'});
            this.layer.render();
            this.listenTo(this.layer, 'command', this.onCommand);
            this.layer.$el.width(this.$el.width());
            this.layer.$el.html(this.template(this.model.toJSON()));

            this.el.value = this.getValueText(this.model.get('value'));
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
            var li = e.event.target;
            var value = li.getAttribute('data-value');
            if (value != this.model.get('value')) {
                this.layer.$('.ui-timepicker-item').removeClass('selected')
                this.layer.$(li).addClass('selected');
                this.model.set('value', value);
                this.trigger('change', value);
                this.el.value = this.getValueText(value);
            }

            this.layer.hide();
        },

        getValueText: function (value) {
            var datasource = this.model.get('datasource');
            var len = datasource.length;
            while (len--) {
                var item = datasource[len];
                if (item.value == value) {
                    return item.text;
                }
            }

            return '';
        }
    });
});
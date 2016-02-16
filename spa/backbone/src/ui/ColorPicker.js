define(function (require) {
    var Backbone = require('Backbone');
    var _ = require('underscore');

    return Backbone.View.extend({
        template: _.template($('#view-ui-colorpicker').html()),
        events: {
            'click .ui-colorpicker-item': 'onItemClick'
        },

        initialize: function () {
            if (!this.model) {
                this.model = new Backbone.Model();
            }

            if (!this.model.get('datasource')) {
                this.model.set('datasource', [
                    '#c23531', '#314656', '#dd8668', '#91c7ae', 
                    '#6e7074', '#bda29a', '#44525d', '#c4ccd3'
                ]);
            }

            if (!this.model.get('value')) {
                this.model.set('value', null);
            }
        },

        render: function () {
            this.$el.addClass('ui-colorpicker');
            var html = this.template(this.model.toJSON());
            this.$el.html(html);
        },

        onItemClick: function (e) {
            var value = e.target.getAttribute('data-value');
            this.$('.ui-colorpicker-item').removeClass('selected')
            this.$(e.target).addClass('selected');
            this.model.set('value', value);
            this.trigger('change', value);
        }
    });
});
define(function (require) {
    var Backbone = require('Backbone');
    var _ = require('underscore');

    return Backbone.View.extend({
        template: _.template($('#view-ui-categorypicker').html()),
        events: {
            'click .ui-categorypicker-item': 'onItemClick'
        },

        render: function () {
            var html = this.template(this.model.toJSON());
            this.$el.html(html);
        },

        onItemClick: function (e) {
            var id = e.target.getAttribute('data-id');
            this.$('.ui-categorypicker-item').removeClass('selected')
            this.$(e.target).addClass('selected');
            this.model.set('value', id);
            this.trigger('change', id);
        }
    });
});
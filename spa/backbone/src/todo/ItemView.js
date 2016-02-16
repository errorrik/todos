define(function (require) {
    var Backbone = require('Backbone');
    var _ = require('underscore');
    var service = require('../service');

    return Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#view-todo-item').html()),
        events: {
            'click .fa-check': 'onTodoDone',
            'click .fa-trash-o': 'onTodoRm'
        },
        
        initialize: function () {
            this.listenTo(this.model, 'remove', this.remove);
        },

        render: function () {
            var html = this.template(this.model.toJSON());
            this.$el.html(html);
            this.updateState();

            return this;
        },

        updateState: function () {
            if (this.model.get('done')) {
                this.$el.addClass('state-done');
            }

            var category = this.model.get('category');
            if (category && category.color) {
                this.$el.css('borderColor', category.color);
            }
        },

        onTodoDone: function (e) {
            var id = this.model.get('id');
            service.done(id).then(this.doneFinished.bind(this));
        },

        doneFinished: function () {
            this.model.set('done', true);
            this.updateState();
        },

        onTodoRm: function (e) {
            var id = this.model.get('id');
            service.rm(id).then(this.rmFinished.bind(this));
        },

        rmFinished: function () {
            this.model.collection.remove(this.model);
        }
    });
});
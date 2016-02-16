define(function (require) {
    var Backbone = require('Backbone');
    var _ = require('underscore');

    var ColorPicker = require('../ui/ColorPicker');

    return Backbone.View.extend({
        tagName: 'li',
        template: _.template($('#view-category-edit-item').html()),
        events: {
            'click .fa-check': 'onEdit',
            'click .fa-trash': 'onRm',
            'blur .category-title': 'onTitieFinished'
        },
        
        initialize: function () {
            this.listenTo(this.model, 'remove', this.remove);
        },

        render: function () {
            var html = this.template(this.model.toJSON());
            this.$el.html(html);
            this.colorPicker = new ColorPicker({
                el: this.$('.category-color'),
                model: new Backbone.Model({
                    value: this.model.get('color')
                })
            });
            this.colorPicker.render();
            this.listenTo(this.colorPicker, 'change', this.selectColor);

            return this;
        },

        selectColor: function (color) {
            this.model.set('color', color);
        },

        onEdit: function (e) {
            var title = this.model.get('title');

            if (!title) {
                return;
            }

            this.trigger('edit', this.model);
        },

        onRm: function (e) {
            this.trigger('rm', this.model);
        },

        onTitieFinished: function (e) {
            this.model.set('title', e.target.value);
        }
    });
});
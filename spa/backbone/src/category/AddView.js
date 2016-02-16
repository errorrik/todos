define(function (require) {
    var Backbone = require('Backbone');
    var _ = require('underscore');
    var ColorPicker = require('../ui/ColorPicker');
    

    return Backbone.View.extend({
        template: _.template($('#view-category-add').html()),
        events: {
            'click .form-cancel': 'onCancel',
            'click .form-ok': 'onOK',
            'blur .category-title': 'onTitleFinished'
        },

        initialize: function (option) {
            if (!this.model) {
                this.model = new Backbone.Model();
            }
        },

        render: function () {
            var html = this.template();
            this.$el.html(html);

            this.colorPicker = new ColorPicker({
                el: '.form-color',
                model: new Backbone.Model()
            });
            this.colorPicker.render();
            this.listenTo(this.colorPicker, 'change', this.selectColor);
        },

        onTitleFinished: function (e) {
            this.model.set('title', e.target.value);
        },

        onCancel: function () {
            this.trigger('cancel');
        },

        onOK: function () {
            var title = this.model.get('title');
            if (!title) {
                return;
            }

            this.trigger('ok', {
                title: title,
                color: this.model.get('color')
            });
        },

        selectColor: function (color) {
            this.model.set('color', color);
        }
    });
});
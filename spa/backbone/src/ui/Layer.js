define(function (require) {
    var Backbone = require('Backbone');

    return Backbone.View.extend({
        events: {
            'click': 'onClick'
        },

        onClick: function (e) {
            var command = e.target.getAttribute('data-command');
            if (command) {
                this.trigger('command', {
                    name: command,
                    event: e
                });
            }
        },

        render: function () {
            this.hide();
            this.$el.addClass('ui-layer');
            document.body.appendChild(this.el);
        },

        show: function (pos) {
            this.$el.css(pos);
        },

        showBeside: function (el) {
            var pos = el.offset();
            this.$el.css({
                left: pos.left,
                top: pos.top + el.height()
            });
        },

        hide: function () {
            this.$el.css('left', '-10000px');
        }
    });
});

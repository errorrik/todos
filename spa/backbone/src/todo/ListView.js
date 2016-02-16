define(function (require) {
    var Backbone = require('Backbone');
    var _ = require('underscore');
    var ItemView = require('./ItemView');

    return Backbone.View.extend({
        template: _.template($('#view-todo-list').html()),

        renderItem: function (item) {
            var itemView = new ItemView({model: item});
            itemView.render();
            this.childs['item' + item.get('id')] = itemView;
            this.getListWrap().append(itemView.$el);
        },

        render: function () {
            var html = this.template({
                category: this.model.get('category'),
                categories: this.model.get('categories')
            });
            this.$el.html(html);

            this.model.get('todos').each(this.renderItem, this);

            return this;
        },

        getListWrap: function () {
            return this.$('.todo-list');
        }
    });
});
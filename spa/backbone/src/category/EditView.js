define(function (require) {
    var Backbone = require('Backbone');
    var _ = require('underscore');

    var EditItemView = require('./EditItemView');

    return Backbone.View.extend({
        template: _.template($('#view-category-edit').html()),

        renderItem: function (item) {
            var itemView = new EditItemView({model: item});
            itemView.render();
            this.childs['item' + item.id] = itemView;
            this.listenTo(itemView, 'edit', this.editItem);
            this.listenTo(itemView, 'rm', this.rmItem);
            this.$('.edit-category-list').append(itemView.$el);
        },

        render: function () {
            var html = this.template();
            this.$el.html(html);

            this.model.get('categories').each(this.renderItem, this);

            return this;
        },

        rmItem: function (itemModel) {
            this.trigger('rmItem', itemModel);
        },

        editItem: function (itemModel) {
            this.trigger('editItem', itemModel);
        }
    });
});

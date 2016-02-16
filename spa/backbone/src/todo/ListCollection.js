define(function (require) {
    var Backbone = require('Backbone');
    var ItemModel = require('./ItemModel');

    return Backbone.Collection.extend({
        model: ItemModel
    });
});
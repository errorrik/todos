define(function(require) {
    var Controller = require('../Controller');
    var Backbone = require('Backbone');
    var service = require('../service');

    function Add() {
        Controller.apply(this, arguments);
    }
    Controller.derive(Add);

    Add.prototype.initView = function () {
        var View = require('./AddView');
        var view = new View({model: this.model});

        this.listenTo(view, 'ok', this.sendData);
        this.listenTo(view, 'cancel', this.done);
        return view;
    };

    Add.prototype.done = function () {
        var e = {};
        this.trigger('done', e);
        if (e.returnValue !== false) {
            history.back();
        }
    };

    Add.prototype.sendData = function (data) {
        service.addCategory(data).then(this.dataSended.bind(this));
    };


    Add.prototype.dataSended = function () {
        Backbone.trigger('addCategory');
        this.done();
    };

    return Add;
});
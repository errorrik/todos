define(function(require) {
    var Backbone = require('Backbone');
    var _ = require('underscore');

    var props = ['model', 'initModel', 'view', 'initView', 'el', 'query'];
    function Controller(options) {
        options = options || {};
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            if (options[prop]) {
                this[prop] = options[prop];
            }
        }

        this.childs = {};

        this.before();
        if (this.model) {
            this.afterModelInit();
        }
        else {
            this.initModel().then(this.afterModelInit.bind(this));
        }
    }

    _.extend(Controller.prototype, Backbone.Events);

    Controller.prototype.initModel = function () {
        return Promise.resolve(new Backbone.Model());
    };

    Controller.prototype.afterModelInit = function (model) {
        this.model = model;
        this.view = this.initView();

        if (this.view) {
            this.view.childs = {};
            this.view.controller = this;

            $(this.el).append(this.view.$el);
            this.view.render();
        }

        this.after();
    };

    Controller.prototype.initView = function () {
        return new Backbone.View();
    };

    Controller.prototype.dispose = function () {
        for (var key in this.childs) {
            this.childs[key].dispose();
        }
        this.childs = null;

        if (this.view) {
            var childs = this.view.childs;
            for (var key in childs) {
                childs[key].remove();
            }
            this.view.childs = null;
            this.view.controller = null;

            this.view.remove();
        }
    };

    Controller.prototype.before = function () {};
    Controller.prototype.after = function () {};

    Controller.derive = derive.bind(Controller, Controller);

    function derive(base, clazz) {
        function F() {}
        F.prototype = base.prototype;
        clazz.prototype = new F();
        clazz.prototype.constructor = clazz;
        clazz.derive = derive.bind(clazz, clazz);
    }

    return Controller;
});
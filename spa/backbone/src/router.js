define(function (require) {
    var Backbone = require('Backbone');
    
    var allRoutes = {};
    var allRoutesController = {};
    var currentController;
    var mainElement = '#main';
    

    function getRouteMethod(Controller) {
        return function () {
            if (currentController) {
                currentController.dispose();
                currentController = null;
            }

            currentController = new Controller({
                el: mainElement,
                query: Array.prototype.slice.call(arguments, 0)
            });
        };
    }

    return {
        add: function (Controller) {
            var routes = Controller.prototype.routes;
            var name = Controller.prototype.name;
            for (var i = 0; i < routes.length; i++) {
                var url = routes[i];
                allRoutes[url] = name;
                allRoutesController[name] = Controller;
            }
        },

        start: function () {
            var routerExtend = {routes: allRoutes};
            for (var key in allRoutesController) {
                routerExtend[key] = getRouteMethod(allRoutesController[key]);
            }

            var Router = Backbone.Router.extend(routerExtend);
            new Router();
            Backbone.history.start();
        },

        setMainElement: function (el) {
            mainElement = el;
        }
    }
});

// return Backbone.Router.extend({
    //     routes: {
    //         '': 'todos',
    //         'todos': 'todos',
    //         'add': 'add',
    //         'edit/:id': 'edit',
    //         'category/add': 'addCategory',
    //         'category/edit': 'editCategory',
    //         'todos/category/:id': 'todos'
    //     },

    //     todos: function (categoryId) {
    //         Promise.all([service.todos(categoryId), service.categories()])
    //             .then(function (data) {
    //                 var ListCollection = require('./todo/ListCollection');
    //                 var ListView = require('./todo/ListView');

    //                 var todos = new ListCollection(data[0]);
    //                 var categories = data[1];
    //                 var model = new Backbone.Model({
    //                     todos: todos,
    //                     categories: categories,
    //                     category: categoryId
    //                 });
    //                 var view = new ListView({model: model});
    //                 view.render();
    //             });
    //     },

    //     add: function () {
    //         this.toFormPage();
    //     },

    //     edit: function (id) {
    //         this.toFormPage(id);
    //     },

    //     toFormPage: function (id) {
    //         var todoPromise = Promise.resolve({
    //             title: '',
    //             desc: '',
    //             category: null
    //         });

    //         if (id) {
    //             todoPromise = service.todo(id);
    //         }

    //         var ItemModel = require('./todo/ItemModel');
    //         var FormView = require('./todo/FormView');

    //         Promise.all([todoPromise, service.categories()])
    //             .then(function (data) {
    //                 var todo = data[0];
    //                 todo.categories = data[1];
    //                 todo.category = todo.category || null;

    //                 var model = new ItemModel(todo);
    //                 var view = new FormView({model: model});
    //                 view.render();
    //             });
    //     },

    //     addCategory: function () {
    //         var AddView = require('./category/AddView');
    //         var view = new AddView({
    //             el: '#wrap'
    //         });
    //         view.render();
    //     },

    //     editCategory: function () {
    //         service.categories().then(function (categories) {
    //             var collection = new Backbone.Collection(categories);
    //             var model = new Backbone.Model({
    //                 categories: collection
    //             });

    //             var EditView = require('./category/EditView');
    //             var view = new EditView({
    //                 model: model,
    //                 el: '#wrap'
    //             });
    //             view.render();
    //         });
    //     }
    // });
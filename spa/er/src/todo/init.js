define(function (require) {
    var controller = require('er/controller');
    controller.registerAction({
        path: '/',
        type: 'todo/List',
        title: 'Todos'
    });

    controller.registerAction({
        path: '/add',
        type: 'todo/Form'
    });

    controller.registerAction({
        path: '/edit',
        type: 'todo/Form'
    });
});
define(function (require) {
    var controller = require('er/controller');

    controller.registerAction({
        path: '/category/add',
        type: 'category/Add'
    });

    controller.registerAction({
        path: '/category/edit',
        type: 'category/Edit'
    });

});
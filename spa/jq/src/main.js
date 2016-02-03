/**
 * @file 应用入口模块
 * @author errorrik
 */

define(function (require) {
    var app = require('./app');
    var FormAction = require('./form');
    var ListAction = require('./list');

    app.route('/', ListAction);
    app.route(/\/category\/([0-9]+)$/, ListAction);
    app.route('/add', FormAction);
    app.route(/^\/edit\/([0-9]+)$/, FormAction);
    app.start();
});
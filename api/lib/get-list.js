"use strict";

let provider = require('./provider');

module.exports = exports = function () {
    return provider.getData()
        .then(data => data.list);
};
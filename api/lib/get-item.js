"use strict";

let provider = require('./provider');
let fs = require('fs');

module.exports = exports = function (id) {
    return provider.getData()
        .then(
            data => {
                let item;
                data.list.forEach(todo => {
                    if (todo.id === id) {
                        item = todo;
                    }
                });

                return item;
            }
        );
};
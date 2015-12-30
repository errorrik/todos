"use strict";

let provider = require('./provider');
let fs = require('fs');

module.exports = exports = function (item) {
    return provider.getData()
        .then(
            data => {
                data.list = data.list.map(todo => {
                    if (todo.id === item.id) {
                        return item;
                    }

                    return todo;
                });

                return provider.setData(data);
            }
        );
};
"use strict";

let provider = require('./provider');
let fs = require('fs');

module.exports = exports = function (item) {
    return provider.getData()
        .then(
            data => {
                let categories = data.category;
                let last = categories[0];
                let id = last ? last.id + 1 : 1;
                item.id = id;
                item.done = item.done || false;
                categories.unshift(item);

                return provider.setData(data);
            }
        )
        .then(
            () => {return item;}
        );
};
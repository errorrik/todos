"use strict";

let provider = require('./provider');
let fs = require('fs');

module.exports = exports = function (item) {
    return provider.getData()
        .then(
            data => {
                data.category = data.category.map(category => {
                    if (category.id === item.id) {
                        return item;
                    }

                    return category;
                });

                return provider.setData(data);
            }
        ).then(
            () => {
                return item;
            }
        );
};
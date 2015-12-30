"use strict";

let provider = require('./provider');
let fs = require('fs');

module.exports = exports = function (id) {
    return provider.getData()
        .then(
            data => {
                let list = data.list;
                let len = list.length;

                while (len--) {
                    let item = list[len];
                    if (item.id === id) {
                        list.splice(len, 1);
                        break;
                    }
                }

                return provider.setData(data);
            }
        );
};
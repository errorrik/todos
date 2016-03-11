"use strict";

let provider = require('./provider');
let fs = require('fs');

module.exports = exports = function (item) {
    return provider.getData()
        .then(
            data => {
                let list = data.list;
                let last = list[0];
                let id = last ? last.id + 1 : 1;
                item.id = id;
                item.addTime = (new Date()).getTime();
                item.done = false;
                list.unshift(item);

                return provider.setData(data);
            }
        );
};
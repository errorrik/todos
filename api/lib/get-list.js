"use strict";

let provider = require('./provider');

module.exports = exports = function (categoryId) {
    return provider.getData().then(data => {
        let categoryMap = new Map();
        data.category.forEach(category => {
            categoryMap.set(category.id, category);
        });

        var list = data.list;
        if (categoryId) {
            list = list.filter(item => {
                return item.categoryId == categoryId;
            });
        }

        list.forEach(item => {
            if (item.categoryId) {
                item.category = categoryMap.get(item.categoryId);
            }
        });

        list.sort((a, b) => {
            if (a.done == b.done) {
                return b.addTime - a.addTime;
            }
            else if (a.done) {
                return 1;
            }

            return -1;
        });

        return list;
    });
};
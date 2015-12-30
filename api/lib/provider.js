"use strict";

let fs = require('fs');
let path = require('path');
const DB_FILE = path.resolve(__dirname, '../../db/data.json');

exports.getData = function () {
    return new Promise((resolve, reject) => {
        fs.readFile(DB_FILE, 'UTF-8', (err, text) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(JSON.parse(text));
        });
    });
};

exports.setData = function (data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(DB_FILE, JSON.stringify(data, null, 4), 'UTF-8', (err, text) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(data);
        });
    });
};
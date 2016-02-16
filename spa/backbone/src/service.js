/**
 * @file service模块
 * @author errorrik
 */

define(function (require) {
    var HOST = 'http://localhost:8222';

    /**
     * @inner
     */
    function sendRequest(option) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open((option.method || 'GET').toUpperCase(), option.url, true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        var value = xhr.responseText;
                        if (option.dataType === 'json') {
                            value = JSON.parse(value);
                        }

                        resolve(value);
                    }
                    else {
                        reject({
                            status: xhr.status, 
                            message: xhr.responseText
                        });
                    }
                }
            };

            var sendData = null;
            if (/^post$/i.test(option.method)) {
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                if (option.data) {
                    var sendDataBuffer = [];
                    for (var key in option.data) {
                        sendDataBuffer.push(key + '=' + encodeURIComponent(option.data[key]));
                    }
                    sendData = sendDataBuffer.join('&');
                }
            }
            xhr.send(sendData);
        });
    }

    var exports = {};

    exports.todos = function (categoryId) {
        var url = HOST + '/todos';
        if (categoryId) {
            url += '/category/' + categoryId;
        }
        
        return sendRequest({
            url: url,
            dataType: 'json'
        });
    };

    exports.todo = function (id) {
        return sendRequest({
            url: HOST + '/todo/' + id,
            dataType: 'json'
        });
    };

    exports.categories = function () {
        return sendRequest({
            url: HOST + '/categories',
            dataType: 'json'
        });
    };

    exports.done = function (id) {
        return sendRequest({
            url: HOST + '/done',
            method: 'POST',
            dataType: 'json',
            data: {id: id}
        });
    };

    exports.rm = function (id) {
        return sendRequest({
            url: HOST + '/rm',
            method: 'POST',
            dataType: 'json',
            data: {id: id}
        });
    };

    exports.add = function (todo) {
        return sendRequest({
            url: HOST + '/add',
            method: 'POST',
            dataType: 'json',
            data: todo
        });
    };

    exports.edit = function (todo) {
        return sendRequest({
            url: HOST + '/edit',
            method: 'POST',
            dataType: 'json',
            data: todo
        });
    };

    exports.addCategory = function (category) {
        return sendRequest({
            url: HOST + '/add-category',
            method: 'POST',
            dataType: 'json',
            data: category
        });
    };

    exports.editCategory = function (category) {
        return sendRequest({
            url: HOST + '/edit-category',
            method: 'POST',
            dataType: 'json',
            data: category
        });
    };

    exports.rmCategory = function (id) {
        return sendRequest({
            url: HOST + '/rm-category',
            method: 'POST',
            dataType: 'json',
            data: {id: id}
        });
    };

    return exports;
});

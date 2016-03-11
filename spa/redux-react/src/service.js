let HOST = 'http://localhost:8222';

/**
 * @inner
 */
function sendRequest(option) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open((option.method || 'GET').toUpperCase(), option.url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    let value = xhr.responseText;
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

        let sendData = null;
        if (/^post$/i.test(option.method)) {
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            if (option.data) {
                let sendDataBuffer = [];
                for (let key in option.data) {
                    sendDataBuffer.push(key + '=' + encodeURIComponent(option.data[key]));
                }
                sendData = sendDataBuffer.join('&');
            }
        }
        xhr.send(sendData);
    });
}

export function todos(categoryId) {
    let url = HOST + '/todos';
    if (categoryId) {
        url += '/category/' + categoryId;
    }
    
    return sendRequest({
        url: url,
        dataType: 'json'
    });
}

export function todo(id) {
    return sendRequest({
        url: HOST + '/todo/' + id,
        dataType: 'json'
    });
}

export function categories() {
    return sendRequest({
        url: HOST + '/categories',
        dataType: 'json'
    });
}

export function done(id) {
    return sendRequest({
        url: HOST + '/done',
        method: 'POST',
        dataType: 'json',
        data: {id: id}
    });
}

export function rm(id) {
    return sendRequest({
        url: HOST + '/rm',
        method: 'POST',
        dataType: 'json',
        data: {id: id}
    });
}

export function add(todo) {
    return sendRequest({
        url: HOST + '/add',
        method: 'POST',
        dataType: 'json',
        data: todo
    });
}

export function edit(todo) {
    return sendRequest({
        url: HOST + '/edit',
        method: 'POST',
        dataType: 'json',
        data: todo
    });
}

export function addCategory(category) {
    return sendRequest({
        url: HOST + '/add-category',
        method: 'POST',
        dataType: 'json',
        data: category
    });
}

export function editCategory(category) {
    return sendRequest({
        url: HOST + '/edit-category',
        method: 'POST',
        dataType: 'json',
        data: category
    });
}

export function rmCategory(id) {
    return sendRequest({
        url: HOST + '/rm-category',
        method: 'POST',
        dataType: 'json',
        data: {id: id}
    });
}

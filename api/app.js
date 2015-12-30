"use strict";

let express = require('express');
let bodyParser = require('body-parser');
let app = express();
const PORT = 8222;

app.use(bodyParser.urlencoded({ 
    extended: false 
}));

app.get('/', (request, response) => {
    response.end('todos api');
});

app.get('/list', (request, response) => {
    require('./lib/get-list')()
        .then(list => {
            response.json(list);
        })
        .catch(err => {
            console.log(err);
        });
});

app.post('/add', (request, response) => {
    let title = request.body.title;
    let endTime = request.body.endTime;

    require('./lib/add-item')({title, endTime})
        .then(() => {
            response.end('true');
        })
        .catch(err => {
            console.log(err);
        });
});

app.post('/edit', (request, response) => {
    let id = parseInt(request.body.id, 10);
    let title = request.body.title;
    let endTime = request.body.endTime;

    require('./lib/edit-item')({id, title, endTime})
        .then(() => {
            response.end('true');
        })
        .catch(err => {
            console.log(err);
        });
});

app.post('/rm', (request, response) => {
    let id = parseInt(request.body.id, 10);

    require('./lib/rm-item')(id)
        .then(() => {
            response.end('true');
        })
        .catch(err => {
            console.log(err);
        });
});

let server = app.listen(PORT, () => {
    let host = server.address().address;
    if (host === '::') {
        host = '0.0.0.0';
    }

    console.log('Example app listening at http://%s:%s', host, PORT);
});

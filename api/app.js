"use strict";

let express = require('express');
let bodyParser = require('body-parser');
let app = express();
const PORT = 8222;


app.use(bodyParser.urlencoded({ 
    extended: false 
}));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/', (request, response) => {
    response.end('todos api');
});

app.get('/todos', (request, response) => {
    require('./lib/get-list')()
        .then(list => {
            response.json(list);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/todos/category/:categoryId', (request, response) => {
    let id = parseInt(request.params.categoryId, 10);
    require('./lib/get-list')(id)
        .then(list => {
            response.json(list);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/todo/:id', (request, response) => {
    let id = parseInt(request.params.id, 10);
    require('./lib/get-item')(id)
        .then(item => {
            response.json(item);
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/categories', (request, response) => {
    require('./lib/get-categories')()
        .then(list => {
            response.json(list);
        })
        .catch(err => {
            console.log(err);
        });
});

app.post('/add', (request, response) => {
    let title = request.body.title;
    let desc = request.body.desc;
    let endTime = parseInt(request.body.endTime, 10);
    let categoryId = parseInt(request.body.categoryId, 10);

    require('./lib/add-item')({title, desc, endTime, categoryId})
        .then(newTodo => {
            response.json(newTodo);
        })
        .catch(err => {
            console.log(err);
        });
});

app.post('/edit', (request, response) => {
    let id = parseInt(request.body.id, 10);
    let desc = request.body.desc;
    let title = request.body.title;
    let endTime = parseInt(request.body.endTime, 10);
    let categoryId = parseInt(request.body.categoryId, 10);

    require('./lib/edit-item')({id, title, desc, endTime, categoryId})
        .then(edited => {
            response.json(edited);
        })
        .catch(err => {
            console.log(err);
        });
});

app.post('/rm', (request, response) => {
    let id = parseInt(request.body.id, 10);

    require('./lib/rm-item')(id)
        .then(() => {
            response.json(id);
        })
        .catch(err => {
            console.log(err);
        });
});

app.post('/done', (request, response) => {
    let id = parseInt(request.body.id, 10);

    require('./lib/done-item')(id)
        .then(() => {
            response.json(id);
        })
        .catch(err => {
            console.log(err);
        });
});

app.post('/add-category', (request, response) => {
    let title = request.body.title;
    let color = request.body.color;

    require('./lib/add-category')({title, color})
        .then(newCategory => {
            response.json(newCategory);
        })
        .catch(err => {
            console.log(err);
        });
});

app.post('/edit-category', (request, response) => {
    let id = parseInt(request.body.id, 10);
    let color = request.body.color;
    let title = request.body.title;

    require('./lib/edit-category')({id, title, color})
        .then(editedCategory => {
            response.json(editedCategory);
        })
        .catch(err => {
            console.log(err);
        });
});

app.post('/rm-category', (request, response) => {
    let id = parseInt(request.body.id, 10);

    require('./lib/rm-category')(id)
        .then(() => {
            response.json(id);
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

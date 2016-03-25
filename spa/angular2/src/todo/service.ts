import {SERVICE_HOST as HOST} from '../config'
import {sendRequest} from '../common'
import {Injectable} from 'angular2/core'

@Injectable()
export default class TodoService {
    list(categoryId) {
        let url = HOST + '/todos';
        if (categoryId) {
            url += '/category/' + categoryId;
        }
        
        return sendRequest({
            url: url,
            dataType: 'json'
        });
    }

    get(id) {
        return sendRequest({
            url: HOST + '/todo/' + id,
            dataType: 'json'
        });
    }

    done(id) {
        return sendRequest({
            url: HOST + '/done',
            method: 'POST',
            dataType: 'json',
            data: {id: id}
        });
    }

    rm(id) {
        return sendRequest({
            url: HOST + '/rm',
            method: 'POST',
            dataType: 'json',
            data: {id: id}
        });
    }

    add(todo) {
        return sendRequest({
            url: HOST + '/add',
            method: 'POST',
            dataType: 'json',
            data: todo
        });
    }

    edit(todo) {
        return sendRequest({
            url: HOST + '/edit',
            method: 'POST',
            dataType: 'json',
            data: todo
        });
    }
}

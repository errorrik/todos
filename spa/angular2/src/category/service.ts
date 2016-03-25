import {SERVICE_HOST as HOST} from '../config'
import {sendRequest} from '../common'

export default class CategoryService {
    list() {
        return sendRequest({
            url: HOST + '/categories',
            dataType: 'json'
        });
    }

    add(category) {
        return sendRequest({
            url: HOST + '/add-category',
            method: 'POST',
            dataType: 'json',
            data: category
        });
    }

    edit(category) {
        return sendRequest({
            url: HOST + '/edit-category',
            method: 'POST',
            dataType: 'json',
            data: category
        });
    }

    rm(id) {
        return sendRequest({
            url: HOST + '/rm-category',
            method: 'POST',
            dataType: 'json',
            data: {id: id}
        });
    }
}

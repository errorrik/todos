import Router from 'vue-router'
import Vue from 'vue'
import moment from 'moment'
import App from './App.vue'

import TodoListView from './todo/List.vue'
import TodoFormView from './todo/Form.vue'
import CategoryAddView from './category/Add.vue'
import CategoryEditView from './category/Edit.vue'

Vue.filter('toDate', function (value) {
    return new Date(value);
});

Vue.filter('formatDate', function (value, format) {
    return moment(value).format(format);
});

Vue.use(Router);

let router = new Router({
    hashbang: false
});

router.map({
    '/todos': {
        component: TodoListView
    },

    '/': {
        component: TodoListView
    },

    '/todos/category/:category': {
        component: TodoListView
    },

    '/add': {
        component: TodoFormView
    },

    '/edit/:id': {
        component: TodoFormView
    },

    '/category/add': {
        component: CategoryAddView
    },

    '/category/edit': {
        component: CategoryEditView
    }
});


router.start(App, '#wrap');

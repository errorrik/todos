<template>
<a href="#/add" class="todo-add"><i class="fa fa-plus-square"></i></a>
<ul class="filter-category">
    <li 
        v-for="item in categories"
        v-bind:style="{background: item.color}"
        v-bind:class="{'checked': item.id == category}"
    >
        <a href="#/todos/category/{{ item.id }}">{{ item.title }}</a>
    </li>
</ul>
<a href="#/" class="fa fa-close filter-category-clear" v-if="category"></a>

<ul class="todo-list">
    <li v-for="(index, item) in todos" 
        v-bind:style="{'border-color': item.category.color}"
        v-bind:class="{'todo-done': item.done}"
    >
        <h3>{{ item.title }}</h3>
        <p>{{ item.desc }}</p>
        <div class="todo-meta">
            <span v-if="item.category">{{ item.category.title }} | </span>
            <span>预期完成时间: {{ item.endTime | formatDate 'YYYY-MM-DD, h:mm a' }}</span>
        </div>
        <a class="fa fa-pencil" href="#/edit/{{ item.id }}"></a>
        <i class="fa fa-check" v-on:click="doneTodo(index)"></i>
        <i class="fa fa-trash-o" v-on:click="rmTodo(index)"></i>
    </li>
</ul>
</template>


<script>
import {
    todos as getTodos, 
    categories as getCategories,
    rm as rmTodo,
    done as doneTodo
} from '../service'

export default {
    data() {
        return {
            todos: [],
            categories: [],
            category: null
        };
    },

    route: {
        data({to}) {
            let category = to.params.category;
            return Promise.all([getTodos(category), getCategories()])
                .then(
                    ([todos, categories]) => {
                        return {todos, categories, category};
                    }
                );
        }
    },

    methods: {
        doneTodo: function (index) {
            let todo = this.todos[index];

            if (!todo.done) {
                doneTodo(todo.id).then(() => {
                    todo.done = true;
                });
            }
        },

        rmTodo: function (index) {
            rmTodo(this.todos[index].id).then(() => {
                this.todos.splice(index, 1);
            });
        }
    }
}
</script>


<style>
.todo-add {
    display: block;
    box-sizing: border-box;
    border-radius: 5px;
    border: 0;
    margin: 10px auto;
    max-width: 800px;
    background: #6a6a6a;
    color: #fff;
    font-size: 32px;
    text-align: center;
    cursor: pointer;
}

.todo-add:hover {
    background: #222;
}

.filter-category {
    display: inline-block;
}

.filter-category li {
    display: inline-block;
    margin: 5px 5px 5px 0;
    padding: 5px;
    border-radius: 3px;
    cursor: pointer;
    color: #fff;
}

.filter-category li a {
    color: #fff;
    text-decoration: none;
}

.filter-category .checked {
    box-shadow: 0 0 0 2px #ddd inset;
}

.filter-category-clear {
    text-decoration: none;
    color: #fff;
    margin-left: 5px;
}

.todo-list {
    list-style: none;
    box-sizing: border-box;
    border-radius: 5px;
    border: 0;
    margin: 10px auto;
    max-width: 800px;
}

.todo-list h3 {
    font-size: 18px;
    height: 30px;
    margin-bottom: 5px;
    color: #333;
}

.todo-list li {
    padding: 10px;
    background: #eee;
    border-radius: 5px;
    position: relative;
    font-size: 14px;
    color: #666;
    border-left: 8px solid #555;
    margin-bottom: 5px;
}

.todo-list .fa {
    font-size: 14px;
    position: absolute;
    top: 5px;
    display: none;
    color: #60a917;
    text-decoration: none;
    cursor: pointer;
}

.todo-list .fa-trash-o {
    right: 5px;
}

.todo-list .fa-check {
    right: 25px;
}

.todo-list .fa-pencil {
    right: 45px;
}

.todo-list li:hover .fa {
    display: block;
    color: #999;
}

.todo-list .todo-done .fa {
    display: block;
}
.todo-list .todo-done:hover .fa {
    color: #60a917;
}

.todo-list .todo-done { 
    cursor: default;
    opacity: .4;
}

.todo-meta {
    font-size: 10px;
    color: #999;
}
</style>
<template>
<div class="form">
    <input type="text" class="form-title" placeholder="标题" v-model="todo.title" lazy>
    <textarea class="form-desc" placeholder="备注" v-model="todo.desc" lazy></textarea>

    <div id="edit-category-form" title="Edit Category">
        <ul id="edit-category-list"></ul>
    </div>
    <ui-categorypicker v-bind:datasource="categories" v-bind:value.sync="todo.categoryId"></ui-categorypicker>
    <i class="fa fa-plus add-category" v-on:click="addCategory"></i>
    <i class="fa fa-pencil edit-category" v-on:click="editCategory"></i>
    <div>预期完成时间： <ui-calendar v-bind:value.sync="endTimeDate"></ui-calendar><ui-timepicker v-bind:value.sync="endTimeHour"></ui-timepicker></div>
    <div class="form-op">
        <button type="button" class="form-ok" v-on:click="submit"><i class="fa fa-check-circle-o"></i></button>
        <button type="button" class="form-cancel" v-on:click="cancel"><i class="fa fa-times-circle-o"></i></button>
    </div>
</div>
</template>

<script>
import {
    categories as getCategories,
    todo as getTodo,
    add as addTodo,
    edit as editTodo
} from '../service'
import CategoryPicker from '../component/CategoryPicker.vue'
import TimePicker from '../component/TimePicker.vue'
import Calendar from '../component/Calendar.vue'
import Layer from '../component/Layer.vue'
import AddCategory from '../category/Add.vue'
import EditCategory from '../category/Edit.vue'
import $ from 'jquery'


function updateCategories() {
    let me = this;
    getCategories().then(categories => {
        me.categories = categories;
    });
}

let DialogLayer = Layer.extend({
    data() {
        return {
            top: 100,
            left: -1000,
            width: 200
        };
    },

    methods: {
        show() {
            this.left = window.screen.availWidth / 2 - 100;
        },

        hide() {
            this.left = -1000;
        }
    }
});

export default {
    components: {
        'ui-categorypicker': CategoryPicker,
        'ui-timepicker': TimePicker,
        'ui-calendar': Calendar
    },

    data() {
        let now = new Date();
        return {
            todo: {
                id: 0,
                title: '',
                desc: '',
                endTime: now.getTime(),
                categoryId: null,
                done: false
            },
            categories: []
        };
    },

    computed: {
        endTimeDate: {
            get() {
                let date = new Date(this.todo.endTime);
                return new Date(date.getFullYear(), date.getMonth(), date.getDate());
            },

            set(value) {
                let date = new Date(this.todo.endTime);
                date.setFullYear(value.getFullYear());
                date.setMonth(value.getMonth());
                date.setDate(value.getDate());

                this.todo.endTime = date.getTime();
            }
        },

        endTimeHour: {
            get() {
                let date = new Date(this.todo.endTime);
                return date.getHours();
            },

            set(value) {
                let date = new Date(this.todo.endTime);
                date.setHours(value);
                this.todo.endTime = date.getTime();
            }
        }
    },

    route: {
        data({to}) {
            let id = to.params.id;
            let now = new Date();
            now.setMinutes(0);
            now.setSeconds(0);
            let todoPromise = id
                ? getTodo(id)
                : Promise.resolve({
                    id: 0,
                    title: '',
                    desc: '',
                    endTime: now.getTime(),
                    categoryId: null,
                    done: false
                });
            
            return Promise.all([todoPromise, getCategories()])
                .then(
                    ([todo, categories]) => {
                        return {todo, categories};
                    }
                );
        },

        deactivate() {
            if (this.$refs.addCategoryDialog) {
                this.$refs.addCategoryDialog.hide();
            }

            if (this.$refs.editCategoryDialog) {
                this.$refs.editCategoryDialog.hide();
            }

            return new Promise(resolve => {
                this.$nextTick(() => {
                    resolve();
                });
            });
        }
    },

    events: {
        addCategory: updateCategories,
        editCategory: updateCategories,
        rmCategory: updateCategories
    },

    methods: {
        submit() {
            let sendData = addTodo;
            if (this.todo.id) {
                sendData = editTodo;
            }

            sendData(this.todo).then(() => {
                history.back();
            });
        },

        cancel() {
            history.back();
        },

        addCategory() {
            let dialog = this.$refs.addCategoryDialog;
            if (!dialog) {
                dialog = new DialogLayer({
                    parent: this,

                    components: {
                        'ui-addcategory': AddCategory
                    },

                    template: `
                        <div class="ui-layer add-category-layer" 
                            v-bind:style="{top: top + 'px', left: left + 'px', width: width + 'px'}">
                            <ui-addcategory v-bind:categories.sync="categories"></ui-addcategory>
                        </div>
                    `,

                    events: {
                        done(e) {
                            this.hide();
                            e.returnValue = false;
                        }
                    }
                });

                this.$refs.addCategoryDialog = dialog;
                dialog.$mount();
            }

            dialog.show();
        },

        editCategory() {
            let dialog = this.$refs.editCategoryDialog;
            if (!dialog) {
                dialog = new DialogLayer({
                    parent: this,

                    data: {
                        top: 50,
                        categories: JSON.parse(JSON.stringify(this.categories))
                    },

                    components: {
                        'ui-editcategory': EditCategory
                    },

                    template: `
                        <div class="ui-layer edit-category-layer" 
                            v-bind:style="{top: top + 'px', left: left + 'px', width: width + 'px'}">
                            <i class="fa fa-times-circle-o" v-on:click="hide"></i>
                            <ui-editcategory v-bind:categories.once="categories"></ui-editcategory>
                        </div>
                    `
                });
                this.$refs.editCategoryDialog = dialog;
                dialog.$mount();
            }

            dialog.show();
        }
    }
}
</script>


<style>
.add-category-layer .form {
    background: #fff;
}

.add-category-layer .form-title,
.add-category-layer .form-title:hover,
.add-category-layer .form-title:focus {
    background: #eee;
    border: 1px solid #ddd;
    color: #333;
}

.edit-category-layer .fa-times-circle-o {
    color: red;
    cursor: pointer;
    font-size: 16px;
    margin: 5px;
}

.add-category {
    margin: 0 5px;
    cursor: pointer;
}

.edit-category {
    cursor: pointer;
}
</style>
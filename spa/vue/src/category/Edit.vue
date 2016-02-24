<template>
<ul class="edit-category-list">
    <li v-for="(index, item) in categories">
        <input type="text" v-model="item.title" class="form-title">
        <ui-colorpicker v-bind:datasource="colors" v-bind:value.sync="item.color"></ui-colorpicker>
        <i class="fa fa-check" v-on:click="edit(index)"></i>
        <i class="fa fa-trash" v-on:click="rm(index)"></i>
    </li>
</ul>
</template>


<script>
import ColorPicker from '../component/ColorPicker.vue'
import {colors} from '../config.js'
import {editCategory, rmCategory, categories as getCategories} from '../service'
import Vue from 'vue'

export default Vue.extend({
    components: {
        'ui-colorpicker': ColorPicker
    },

    props: {
        categories: {
            default: []
        }
    },

    data() {
        return {
            colors: colors
        };
    },

    route: {
        data() {
            return getCategories().then(categories => {
                return {categories, colors}
            });
        }
    },

    methods: {
        edit(index) {
            let category = this.categories[index];
            editCategory(category)
                .then(() => {
                    this.$dispatch('editCategory', category);
                });
        },

        rm(index) {
            let id = this.categories[index].id;
            rmCategory(id)
                .then(() => {
                    this.categories.splice(index, 1);
                    this.$dispatch('rmCategory', id);
                });
        }
    }
})
</script>


<style>
.edit-category-list input {
    display: block;
}

.edit-category-list .ui-colorpicker {
    display: block;
    margin-top: 3px;
}

.edit-category-list > li {
    margin: 10px;
}

.edit-category-list .fa-check {
    cursor: pointer;
    color: green;
}

.edit-category-list .fa-trash {
    cursor: pointer;
    color: red;
}

.edit-category-list .form-title,
.edit-category-list .form-title:hover,
.edit-category-list .form-title:focus {
    background: #eee;
    border: 1px solid #ddd;
    color: #333;
}
</style>

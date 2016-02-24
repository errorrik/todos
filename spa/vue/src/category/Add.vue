<template>
<div class="form">
    <input type="text" placeholder="分类" class="form-title" v-model="title">
    <ui-colorpicker v-bind:datasource="colors" v-bind:value.sync="color"></ui-colorpicker>
    <div class="form-op">
        <button type="button" class="form-ok" v-on:click="submit"><i class="fa fa-check-circle-o"></i></button>
        <button type="button" class="form-cancel" v-on:click="cancel"><i class="fa fa-times-circle-o"></i></button>
    </div>
</div>
</template>


<script>
import ColorPicker from '../component/ColorPicker.vue'
import {colors} from '../config.js'
import {addCategory} from '../service'
import Vue from 'vue'

export default Vue.extend({
    components: {
        'ui-colorpicker': ColorPicker
    },

    data() {
        return {
            colors: colors,
            title: '',
            color: null
        };
    },

    methods: {
        submit() {
            if (this.title) {
                addCategory({color: this.color, title: this.title})
                    .then(() => {
                        this.$dispatch('addCategory');
                        this.cancel();
                    });
            }
        },

        cancel() {
            this.title = '';
            this.color = null;

            let e = {};
            this.$dispatch('done', e);

            if (e.returnValue !== false) {
                history.back();
            }
        }
    }
})
</script>
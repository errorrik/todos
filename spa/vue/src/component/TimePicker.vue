<template>
<div v-on:click="mainClick" class="ui-timepicker">{{ value | valueText }}</div>
</template>


<script>
import Vue from 'vue'
import $ from "jquery"
import Layer from './Layer.vue'


export default {
    props: [
        'value'
    ],

    data() {
        return {
            datasource: [
                {text: '12:00am', value: 0},
                {text: '1:00am', value: 1},
                {text: '2:00am', value: 2},
                {text: '3:00am', value: 3},
                {text: '4:00am', value: 4},
                {text: '5:00am', value: 5},
                {text: '6:00am', value: 6},
                {text: '7:00am', value: 7},
                {text: '8:00am', value: 8},
                {text: '9:00am', value: 9},
                {text: '10:00am', value: 10},
                {text: '11:00am', value: 11},
                {text: '12:00pm', value: 12},
                {text: '1:00pm', value: 13},
                {text: '2:00pm', value: 14},
                {text: '3:00pm', value: 15},
                {text: '4:00pm', value: 16},
                {text: '5:00pm', value: 17},
                {text: '6:00pm', value: 18},
                {text: '7:00pm', value: 19},
                {text: '8:00pm', value: 20},
                {text: '9:00pm', value: 21},
                {text: '10:00pm', value: 22},
                {text: '11:00pm', value: 23}
            ],
            left: -10000,
            top: -10000
        };
    },

    methods: {
        mainClick() {
            if (this.left >= 0) {
                this.hide();
            }
            else {
                this.show();
            }
        },

        hide: function () {
            this.left = -10000;
        },

        show: function () {
            let pos = $(this.$el).offset();
            this.left = pos.left;
            this.top = pos.top + this.$el.offsetHeight + 1;
        }
    },

    filters: {
        valueText(value) {
            let i = this.datasource.length;
            while (i--) {
                let item = this.datasource[i];
                if (item.value == value) {
                    return item.text;
                }
            }

            return '';
        }
    },

    ready() {
        this._docClicker = e => {
            if (e.target != this.$el) {
                this.hide();
            }
        };

        $(document).on('click', this._docClicker);

        let listLayer = new Layer({
            parent: this,
            data: {
                datasource: this.datasource, 
                value: null,
                left: this.left,
                top: this.top
            },
            template: `
                <ul class="ui-layer ui-timepicker-layer" v-bind:style="{left: left + 'px', top: top + 'px'}">
                    <li v-for="(index, item) in datasource" v-bind:class="{selected: item.value == value}" v-on:click="itemClick(index)">{{ item.text }}</li>
                </ul>
            `,
            methods: {
                itemClick(index) {
                    this.value = this.datasource[index].value;
                }
            },
            watch: {
                value: v => {
                    this.value = v;
                }
            }
        });

        this.$watch('value', value => {
            listLayer.value = value;
        });

        this.$watch('left', value => {
            listLayer.left = value;
        });

        this.$watch('top', value => {
            listLayer.top = value;
        });

        listLayer.$mount();
    },

    beforeDestroy() {
        $(document).off('click', this._docClicker);
        this._docClicker = null;
    }
}
</script>


<style>
.ui-timepicker {
    width: 70px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
}

.ui-timepicker:hover {
    background: #444;
}

.ui-timepicker-layer {
    font-size: 12px;
    border: 1px solid #ddd;
    width: 70px;
}

.ui-timepicker-layer li {
    text-align: center;
    cursor: pointer;
}

.ui-timepicker-layer li:hover {
    background: #eee;
}

.ui-timepicker-layer li.selected {
    background: #eee;
}
</style>
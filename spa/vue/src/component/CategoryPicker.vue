<template>
<ul class="ui-categorypicker">
    <li 
        v-for="(index, item) in datasource" 
        v-bind:style="{'background': item.color}"
        v-bind:class="{'selected': item.id == value}"
        v-on:click="itemClick(index)"
    >{{ item.title }}</li>
</ul>
</template>


<script>
export default {
    props: {
        value: {
            default: null
        },
        datasource: {
            default: []
        }
    },

    methods: {
        itemClick: function (index) {
            this.value = this.datasource[index].id;
        }
    }
}
</script>


<style>
.ui-categorypicker {
    display: inline-block;
}

.ui-categorypicker li {
    display: inline-block;
    margin: 5px 5px 5px 0;
    padding: 5px;
    border-radius: 3px;
    cursor: pointer;
    color: #fff;
}

.ui-categorypicker li a {
    color: #fff;
    text-decoration: none;
}

.ui-categorypicker .selected {
    box-shadow: 0 0 0 2px #ddd inset;
}
</style>
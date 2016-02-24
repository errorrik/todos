<template>
<ul class="ui-colorpicker">
    <li 
        v-for="item in datasource" 
        v-bind:style="{'background': item}"
        v-bind:class="{'selected': item == value}"
        v-on:click="itemClick(item)"
    ></li>
</ul>
</template>


<script>
export default {
    props: [
        'value',
        'datasource'
    ],

    methods: {
        itemClick: function (item) {
            this.value = item;
        }
    }
}
</script>


<style>
.ui-colorpicker {
    list-style: none;
    display: inline-block;
}

.ui-colorpicker li {
    display: inline-block;
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.ui-colorpicker .selected {
    box-shadow: 0 0 0 2px #ddd inset;
}
</style>
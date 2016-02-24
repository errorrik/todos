<template>
<div class="ui-layer"></div>
</template>


<script>
import Vue from 'vue'

export default Vue.extend({
    compiled() {
        this.$appendTo('body');
    }
})
</script>


<style>
.ui-layer {
    position: absolute;
    background: #fff;
    color: #666;
}
</style>
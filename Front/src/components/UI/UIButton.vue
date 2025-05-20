<template>
    <button class="btn">
        <slot>

        </slot>
    </button>
</template>

<script setup>
    import { defineOptions } from 'vue';

    defineOptions({
        name: 'ui-button'
    })
</script>

<style scoped>
    .btn {
        padding: 10px 15px;
        background: none;
        color: teal;
        border: 1px solid teal;
    }
</style>
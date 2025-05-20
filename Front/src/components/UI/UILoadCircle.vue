<template>
    <div class="spinner"></div>
</template>

<script setup>
    import { defineOptions } from 'vue';
    defineOptions({
        name: 'load-circle'
    })
</script>

<style scoped>
     .spinner {
        width: 50px;
        height: 50px;
        border: 5px solid white;
        border-top: 5px solid teal;
        border-right: 5px solid teal;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0%{ transform: rotate(0deg);}
        100%{ transform: rotate(360deg);}
    } 
</style>
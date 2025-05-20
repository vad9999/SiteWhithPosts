<template>
    <div @submit.prevent>
        <load-circle/>
        <ui-input type="password" v-model="username"/>
        <ui-button>вавыаыв</ui-button>
    </div>
</template>

<script setup>
    import {ref} from 'vue'
    const username = ref('')
</script>

<style scoped>

</style>
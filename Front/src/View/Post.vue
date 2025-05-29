<template>
    <n-text>{{ postId }}</n-text>
</template>

<script setup>
    import { useRoute } from 'vue-router'
    import { NText } from 'naive-ui'

    const route = useRoute()
    const postId = route.params.id
</script>

<style scoped>

</style>
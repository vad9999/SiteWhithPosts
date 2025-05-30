<template>
    <n-button @click="toHome">Назад</n-button>
</template>

<script setup>
    import { NButton } from 'naive-ui';
    import { useRouter } from 'vue-router';

    const router = useRouter()

    const toHome = () => {
        router.push('/home')
    }
</script>

<style scoped>
</style>
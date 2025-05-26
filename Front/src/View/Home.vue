<template>
    <div style="width: 100px; height: 100px;">{{ userStore.user }}</div>
</template>

<script setup>
    import { useUserStore } from '../store/useUserStore';
    const userStore = useUserStore()
</script>

<style scoped>
</style>
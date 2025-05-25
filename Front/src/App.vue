<template>
  <n-config-provider :theme="themeStore.theme === 'dark' ? darkTheme : null">
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
    import { darkTheme, NConfigProvider, NMessageProvider } from 'naive-ui'
    import {useThemeStore} from './store/useThemeStore'
    import { watch } from 'vue'
    const themeStore = useThemeStore()

    watch(
    () => themeStore.theme,
    (newTheme) => {
        if (newTheme === 'dark') {
        document.body.classList.add('dark')
        } else {
        document.body.classList.remove('dark')
        }
    },
    { immediate: true }
    )
</script>

<style>
    body {
    background-color: white;
    color: rgb(57, 57, 57);
    transition: background-color 0.3s, color 0.3s;
    }

    body.dark {
    background-color: #121212;
    color: #eee;
    }
</style>

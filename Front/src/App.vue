<template>
  <n-config-provider :theme="themeStore.theme === 'dark' ? darkTheme : null">
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
    import { darkTheme, NConfigProvider, NMessageProvider } from 'naive-ui'
    import { useThemeStore } from './store/useThemeStore'
	import { useUserStore } from './store/useUserStore'
    import { watch, onMounted, onBeforeUnmount } from 'vue'
	import { useRouter, useRoute } from 'vue-router'

    const themeStore = useThemeStore()
	const userStore = useUserStore()
	const router = useRouter()
	const route = useRoute()

	const handlePopState = () => {
		// Задержка нужна, чтобы route обновился после изменения истории
		setTimeout(() => {
			const currentPath = router.currentRoute.value.path
			if (currentPath === '/') {
			userStore.logout()
			}
		}, 0)
	}

    watch(
		() => themeStore.theme,
		(newTheme) => {
			if (newTheme === 'dark') {
				document.body.classList.add('dark')
			} else {
				document.body.classList.remove('dark')
			}
		},
		{ immediate: true })
	
	onMounted(() => {
  		window.addEventListener('popstate', handlePopState)
	})

	onBeforeUnmount(() => {
  		window.removeEventListener('popstate', handlePopState)
})
</script>

<style>
	* {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

    body {
    background-color: white;
    color: black;
    transition: background-color 0.3s, color 0.3s;
    }

    body.dark {
    background-color: #252525;
    color: #eee;
    }
</style>

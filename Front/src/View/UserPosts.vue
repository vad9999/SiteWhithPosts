<template>
    <n-button type="default" @click="toHome">Назад</n-button>
    <div @click="themeStore.toggleTheme" style="width: 40px; height: 40px;">
        <component :is="themeStore.theme === 'dark' ? Sunny : Moon" 
        style="width: 40px; height: 40px; color: currentColor;"/>
    </div>
    <n-card v-for="userPost in postStore.userPosts">
        <n-form>
           <n-form-item>
            {{ userPost.title }}
           </n-form-item>

           <n-form-item>
            {{ userPost.body }}
           </n-form-item>

           <n-form-item>
            {{ userPost.createdAt }}
           </n-form-item>

           <n-form-item>
            {{ userPost.themePostName }}
           </n-form-item>
        </n-form>
    </n-card>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { NCard, NForm, NFormItem, NButton, useMessage } from 'naive-ui';
    import { useUserStore } from '../store/useUserStore';
    import { usePostStore } from '../store/usePostStore';
    import { useThemeStore } from '../store/useThemeStore';
    import { useRouter } from 'vue-router';
    import { Moon, Sunny } from '@vicons/ionicons5'

    const userStore = useUserStore()
    const postStore = usePostStore()
    const themeStore = useThemeStore()
    const message = useMessage()
    const router = useRouter()

    const fetchUserPosts = async () => {
        const success = await postStore.fetchUserPosts(userStore.user.id)
        if(success) {
            message.success('Посты загружены')
        } else {
            message.error('Посты не загружены')
        }
    }

    onMounted(async () => {
        await fetchUserPosts()
    })

    const toHome = () => {
        router.push('/home')
    }
</script>

<style scoped>

</style>
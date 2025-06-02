<template>
    <n-button @click="toHome">Назад</n-button>
    <n-input v-model:value="userName" placeholder="ник"></n-input>
    <n-input v-model:value="email"  placeholder="эл. почта"></n-input>
    <n-input v-model:value="login"  placeholder="логин"></n-input>
    <n-input v-model:value="password"  placeholder="пароль"></n-input>
    <n-button @click="changeData">Сохранить</n-button>
    <n-button @click="deleteUser">Удалить аккаунт</n-button>
</template>

<script setup>
    import { ref } from 'vue'
    import { NButton, NInput, useMessage } from 'naive-ui';
    import { useRouter } from 'vue-router';
    import { useUserStore } from '../store/useUserStore';

    const router = useRouter()
    const userStore = useUserStore()
    const message = useMessage()

    const userName = ref('')
    const email = ref('')
    const login = ref('')
    const password = ref('')

    const toHome = () => {
        router.push('/home')
    }

    const changeData = async () => {
        try {
            const updatedUser = {}

            const oldLogin = userStore.user.login
            const oldPassword = userStore.user.password // Если хранится в клиенте — хотя это плохая практика

            if (userName.value?.trim()) updatedUser.userName = userName.value
            if (email.value?.trim()) updatedUser.email = email.value
            if (login.value?.trim()) updatedUser.login = login.value
            if (password.value?.trim()) updatedUser.password = password.value

            if (Object.keys(updatedUser).length === 0) {
                message.warning('Нет данных для обновления')
                return
            }

            const success = await userStore.updateUser(userStore.user.id, updatedUser)

            if (success) {
                message.success('Данные успешно обновлены')

                const loginChanged = updatedUser.login && updatedUser.login !== oldLogin
                const passwordChanged = updatedUser.password && updatedUser.password !== oldPassword

                if (loginChanged || passwordChanged) {
                    // Очистка сессии и переход на логин
                    userStore.user = null
                    message.info('Логин или пароль изменён. Пожалуйста, войдите снова.')
                    router.push('/')
                }
            } else {
                message.error('Ошибка при обновлении данных')
            }
        } catch (e) {
            console.error('Ошибка изменения данных:', e)
            message.error('Ошибка изменения данных')
        }
    }



    const deleteUser = async () => {
        const success = await userStore.deleteUser(userStore.user.id)
        if(success) {
            router.push('/')
            message.success('Аккунт удален')
        } else {
            message.error('Ошибка удаления')
        }
    }
</script>

<style scoped>
</style>
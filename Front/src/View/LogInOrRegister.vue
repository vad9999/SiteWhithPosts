<template>
    <div>
        <div>
        <n-button type="default" @click="themeStore.toggleTheme">
            <component :is="themeStore.theme === 'dark' ? Moon : Sunny" 
            style="width: 24px; height: 24px; color: currentColor;"/>
        </n-button>
    </div>

  <n-card title="Вход в систему" style="max-width: 400px; margin: auto;" v-if="isLogIn">
    <n-form @submit.prevent="handleLogin" :model="formLogIn">
      <n-form-item label="Логин" path="login">
        <n-input v-model:value="formLogIn.login" placeholder="Введите логин" />
      </n-form-item>

      <n-form-item label="Пароль" path="password">
        <n-input
          v-model:value="formLogIn.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Введите пароль"
        >
          <template #suffix>
            <n-icon @click="togglePasswordVisibility" style="cursor: pointer">
              <component :is="showPassword ? EyeOff : Eye" />
            </n-icon>
          </template>
        </n-input>
      </n-form-item>

      <n-form-item>
        <n-button type="primary" block @click="handleLogin">Войти</n-button>
      </n-form-item>

      <n-form-item>
        <n-button type="primary" block @click="isLogIn = false">Регистрация</n-button>
      </n-form-item>
    </n-form>
  </n-card>

  <n-card title="Регистрация" style="max-width: 400px; margin: auto;" v-else>
    <n-form @submit.prevent="handleRegistration" :model="formRegister">
      <n-form-item label="Ник" path="fullName">
        <n-input v-model:value="formRegister.fullName" placeholder="Введите ник" />
      </n-form-item>

      <n-form-item label="Эл. почта" path="email">
        <n-input v-model:value="formRegister.email" placeholder="Введите эл. почту" />
      </n-form-item>

      <n-form-item label="Логин" path="login">
        <n-input v-model:value="formRegister.login" placeholder="Введите логин" />
      </n-form-item>

      <n-form-item label="Пароль" path="password">
        <n-input
          v-model:value="formRegister.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Введите пароль"
        >
          <template #suffix>
            <n-icon @click="togglePasswordVisibility" style="cursor: pointer">
              <component :is="showPassword ? EyeOff : Eye" />
            </n-icon>
          </template>
        </n-input>
      </n-form-item>

      <n-form-item>
        <n-button type="primary" block @click="handleRegistration">Зарегистрироваться</n-button>
      </n-form-item>

      <n-form-item>
        <n-button type="primary" block @click="isLogIn = true">Назад</n-button>
      </n-form-item>
    </n-form>
    </n-card>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { Eye, EyeOff } from '@vicons/tabler'
    import { useMessage, NCard, NForm, NFormItem, NInput, NButton, NIcon } from 'naive-ui'
    import { useThemeStore} from '../store/useThemeStore'
    import { Moon, Sunny } from '@vicons/ionicons5'

    const themeStore = useThemeStore()

    const message = useMessage()

    const formLogIn = ref({
    login: '',
    password: '',
    })

    const formRegister = ref({
        login: '',
        password: '',
        fullName: '',
        email: ''
    })

    const showPassword = ref(false)
    const isLogIn = ref(false)

    const togglePasswordVisibility = () => {
        showPassword.value = !showPassword.value
    }

    const handleLogin = () => {
    if (!formLogIn.value.login || !formLogIn.value.password) {
        message.error('Заполните логин и пароль')
        return
    }
    // TODO: заменить на запрос к API
    message.success(`Добро пожаловать, ${formLogIn.value.login}!`)
    }

    const handleRegistration = () => {
    if (!formRegister.value.login || !formRegister.value.password || !formRegister.value.fullName) {
        message.error('Заполните логин, пароль и ник')
        return
    }
    // TODO: заменить на запрос к API
    message.success(`Добро пожаловать, ${formRegister.value.login}!`)
    }
</script>
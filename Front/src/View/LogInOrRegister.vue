<template>
  <div>
    <div @click="themeStore.toggleTheme" style="width: 40px; height: 40px">
      <component
        :is="themeStore.theme === 'dark' ? Sunny : Moon"
        style="width: 40px; height: 40px; color: currentColor"
      />
    </div>

    <n-card
      title="Вход в систему"
      style="max-width: 400px; margin: auto"
      v-if="isLogIn"
    >
      <n-form @submit.prevent="handleLogin" :model="formLogIn">
        <n-form-item label="Логин" path="login">
          <n-input
            v-model:value="formLogIn.login"
            placeholder="Введите логин"
          />
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
        <n-flex>
          <n-button type="primary" block @click="handleLogin">Войти</n-button>
          <n-button type="primary" block @click="isLogIn = false"
            >Регистрация</n-button
          >
        </n-flex>
      </n-form>
    </n-card>

    <n-card title="Регистрация" style="max-width: 400px; margin: auto" v-else>
      <n-form @submit.prevent="handleRegistration" :model="formRegister">
        <n-form-item label="Ник" path="userName">
          <n-input
            v-model:value="formRegister.userName"
            placeholder="Введите ник"
          />
        </n-form-item>

        <n-form-item label="Эл. почта" path="email">
          <n-input
            v-model:value="formRegister.email"
            placeholder="Введите эл. почту"
          />
        </n-form-item>

        <n-form-item label="Логин" path="login">
          <n-input
            v-model:value="formRegister.login"
            placeholder="Введите логин"
          />
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

        <n-flex>
          <n-button type="primary" block @click="handleRegistration"
            >Зарегистрироваться</n-button
          >
          <n-button type="primary" block @click="isLogIn = true"
            >Назад</n-button
          >
        </n-flex>
      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Eye, EyeOff } from "@vicons/tabler";
import {
  useMessage,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NIcon,
  NFlex,
} from "naive-ui";
import { useThemeStore } from "../store/useThemeStore";
import { Moon, Sunny } from "@vicons/ionicons5";
import { useUserStore } from "../store/useUserStore";
import { useRouter } from "vue-router";
import User from "../models/User";

const themeStore = useThemeStore();
const userStore = useUserStore();
const router = useRouter();

const message = useMessage();

const formLogIn = ref({
  login: "",
  password: "",
});

const formRegister = ref({
  login: "",
  password: "",
  userName: "",
  email: "",
});

const showPassword = ref(false);
const isLogIn = ref(true);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  if (!formLogIn.value.login || !formLogIn.value.password) {
    message.error("Заполните логин и пароль");
    return;
  }
  const success = await userStore.fetchUserAuth(
    formLogIn.value.login,
    formLogIn.value.password
  );
  if (success) {
    router.push("/home");
    message.success(`Добро пожаловать, ${userStore.user.userName}!`);
  } else {
    message.error("Не верный логин или пароль");
  }
};

const handleRegistration = async () => {
  if (
    !formRegister.value.login ||
    !formRegister.value.password ||
    !formRegister.value.userName
  ) {
    message.error("Заполните логин, пароль и ник");
    return;
  }

  const user = new User({
    userName: formRegister.value.userName,
    email: formRegister.value.email,
    login: formRegister.value.login,
    password: formRegister.value.password,
  });

  const success = await userStore.addUser(user);

  if (success) {
    router.push("/home");
    message.success(`Добро пожаловать, ${formRegister.value.userName}!`);
  } else {
    message.error("Ошибка регистрации");
  }
};
</script>

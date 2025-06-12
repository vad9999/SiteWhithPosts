<template>
  <div
    style="display: flex; justify-content: flex-end; padding: 16px 16px 0px 0px"
  >
    <n-button @click="toHome">Назад</n-button>
  </div>

  <n-card style="max-width: 400px; margin: auto">
    <n-form>
      <n-form-item label="Ник">
        <n-input v-model:value="userName" placeholder="Ник" />
      </n-form-item>

      <n-form-item label="Эл. почта">
        <n-input v-model:value="email" placeholder="Эл. почта" />
      </n-form-item>

      <n-form-item label="Логин">
        <n-input v-model:value="login" placeholder="Логин" />
      </n-form-item>

      <n-form-item label="Пароль">
        <n-input v-model:value="password" placeholder="Пароль" />
      </n-form-item>
      <n-flex>
        <n-button @click="changeData" type="primary">Сохранить</n-button>
        <n-button @click="deleteUser" type="error">Удалить аккаунт</n-button>
      </n-flex>
    </n-form>
  </n-card>
</template>

<script setup>
import { ref } from "vue";
import {
  NButton,
  NInput,
  useMessage,
  NCard,
  NForm,
  NFlex,
  NFormItem,
} from "naive-ui";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/useUserStore";

const router = useRouter();
const userStore = useUserStore();
const message = useMessage();

const userName = ref("");
const email = ref("");
const login = ref("");
const password = ref("");

const toHome = () => {
  router.push("/home");
};

const changeData = async () => {
  try {
    const updatedUser = {};

    const oldLogin = userStore.user.login;
    const oldPassword = userStore.user.password;

    if (userName.value?.trim()) updatedUser.userName = userName.value;
    if (email.value?.trim()) updatedUser.email = email.value;
    if (login.value?.trim()) updatedUser.login = login.value;
    if (password.value?.trim()) updatedUser.password = password.value;

    if (Object.keys(updatedUser).length === 0) {
      message.warning("Нет данных для обновления");
      return;
    }

    const success = await userStore.updateUser(userStore.user.id, updatedUser);

    if (success) {
      message.success("Данные успешно обновлены");

      const loginChanged = updatedUser.login && updatedUser.login !== oldLogin;
      const passwordChanged =
        updatedUser.password && updatedUser.password !== oldPassword;

      if (loginChanged || passwordChanged) {
        userStore.user = null;
        message.info("Логин или пароль изменён. Пожалуйста, войдите снова.");
        router.push("/");
      }
    } else {
      message.error("Ошибка при обновлении данных");
    }
  } catch (e) {
    console.error("Ошибка изменения данных:", e);
    message.error("Ошибка изменения данных");
  }
};

const deleteUser = async () => {
  const success = await userStore.deleteUser(userStore.user.id);
  if (success) {
    router.push("/");
    message.success("Аккунт удален");
  } else {
    message.error("Ошибка удаления");
  }
};
</script>

<style scoped></style>
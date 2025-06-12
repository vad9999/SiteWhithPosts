<template>
  <div
    style="
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 12px;
      padding: 16px 16px 0 0;
      margin-bottom: 16px;
    "
  >
    <div @click="themeStore.toggleTheme" style="cursor: pointer">
      <component
        :is="themeStore.theme === 'dark' ? Sunny : Moon"
        style="width: 28px; height: 28px; color: currentColor"
      />
    </div>
    <n-button @click="toHome">Назад</n-button>
    <n-button type="primary" @click="loadThemePost">Добавить</n-button>
  </div>

  <div
    style="
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    "
  >
    <n-card
      v-for="userPost in postStore.userPosts"
      :key="userPost.id"
      size="medium"
      hoverable
      style="
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
      "
      @click="toPost(userPost.id)"
    >
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <n-text strong style="font-size: 16px">{{ userPost.title }}</n-text>
        <n-text depth="3" style="font-size: 12px">{{
          dateStore.formatDate(userPost.createdAt)
        }}</n-text>
      </div>

      <n-text depth="2" style="margin: 8px 0">
        {{
          userPost.body.length > 100
            ? userPost.body.slice(0, 100) + "..."
            : userPost.body
        }}
      </n-text>

      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        "
      >
        <n-text>{{ userPost.themePostName }}</n-text>
        <div style="display: flex; align-items: center; gap: 8px">
          <n-button text @click.stop="react(userPost.id, 'like')">
            <component
              :is="getLikeIcon(userPost.id)"
              style="width: 24px; height: 24px"
              :style="{ color: getReactionColor(userPost.id, 'like') }"
            />
          </n-button>
          <n-text>{{ reactionStore.getReactions(userPost.id).likes }}</n-text>

          <n-button text @click.stop="react(userPost.id, 'dislike')">
            <component
              :is="getDislikeIcon(userPost.id)"
              style="width: 24px; height: 24px"
              :style="{ color: getReactionColor(userPost.id, 'dislike') }"
            />
          </n-button>
          <n-text>{{
            reactionStore.getReactions(userPost.id).dislikes
          }}</n-text>
        </div>
      </div>
    </n-card>

    <n-modal
      v-model:show="showModal"
      title="Добавить пост"
      preset="dialog"
      :closable="false"
    >
      <n-form :model="formData" :rules="rules" ref="formRef">
        <n-form-item label="Название" path="title">
          <n-input
            v-model:value="formData.title"
            placeholder="Введите название"
          />
        </n-form-item>

        <n-form-item label="Описание" path="body">
          <n-input
            v-model:value="formData.body"
            placeholder="Введите описание"
            type="textarea"
          />
        </n-form-item>

        <n-form-item label="Тема" path="themePostId">
          <n-select
            v-if="themeOptions.length"
            v-model:value="formData.themePostId"
            :options="themeOptions"
            placeholder="Выберите тему"
          />
        </n-form-item>
        <n-flex style="justify-content: space-between">
          <n-button @click="showModal = false">Отмена</n-button>
          <n-button type="primary" @click="submitForm">Сохранить</n-button>
        </n-flex>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { NCard, NForm, NFormItem, NButton, useMessage, NText, NModal, NFlex, NSelect, NInput } from "naive-ui";
import { useUserStore } from "../store/useUserStore";
import { usePostStore } from "../store/usePostStore";
import { useThemeStore } from "../store/useThemeStore";
import { useReactionStore } from "../store/useReactionStore";
import { useRouter } from "vue-router";
import { useDateStore } from "../store/useDateStore";
import { useThemePostStore } from "../store/useThemePostStore";
import {
  Moon,
  Sunny,
  Heart,
  HeartDislike,
  HeartOutline,
  HeartDislikeOutline,
} from "@vicons/ionicons5";
import Post from "../models/Post";

const userStore = useUserStore();
const postStore = usePostStore();
const themeStore = useThemeStore();
const message = useMessage();
const router = useRouter();
const dateStore = useDateStore();
const reactionStore = useReactionStore();
const themePostStore = useThemePostStore();

const react = async (postId, type) => {
  const res = await reactionStore.toggleReaction({ postId, type });
  if (res) {
    await reactionStore.fetchReactionsForPosts([postId], userStore.user.id);
  }
};

const getLikeIcon = (postId) => {
  const reaction = reactionStore.getReactions(postId).userReaction;
  return reaction === "like" ? Heart : HeartOutline;
};

const getDislikeIcon = (postId) => {
  const reaction = reactionStore.getReactions(postId).userReaction;
  return reaction === "dislike" ? HeartDislike : HeartDislikeOutline;
};

const getReactionColor = (postId, type) => {
  const current = reactionStore.getReactions(postId).userReaction;
  if (current === type) {
    return type === "like" ? "#ff4d4f" : "#8c8c8c";
  }
  return "#aaa";
};

const loadThemePost = async () => {
  showModal.value = true;
  await themePostStore.fetchThemePosts();
  themeOptions.value = themePostStore.themePosts.map((theme) => ({
    label: theme.name,
    value: theme.id,
  }));
};

const toPost = (postId) => {
  if (!postId) {
    console.error("postId is missing!");
    return;
  }
  router.push({ name: "Post", params: { id: postId } });
};

const fetchUserPosts = async () => {
  const success = await postStore.fetchUserPosts(userStore.user.id);
  if (success) {
    message.success("Посты загружены");
  } else {
    message.error("Посты не загружены");
  }
};

onMounted(async () => {
  await fetchUserPosts();
});

const toHome = () => {
  router.push("/home");
};

const showModal = ref(false);
const themeOptions = ref([]);

const formData = ref({
  title: "",
  body: "",
  themePostId: null,
});

const formRef = ref(null);

const rules = {
  title: [{ required: true, message: "Введите название", trigger: "blur" }],
  body: [{ required: true, message: "Введите описание", trigger: "blur" }],
  themePostId: [
    {
      required: true,
      type: "number",
      message: "Выберите тему",
      trigger: "change",
    },
  ],
};

const submitForm = async () => {
  try {
    await formRef.value?.validate();

    const post = new Post({
      title: formData.value.title,
      body: formData.value.body,
      themePostId: formData.value.themePostId,
      userId: userStore.user.id,
    });

    const success = await postStore.addPost(post);
    if (success) {
      showModal.value = false;
      formData.value.title = "";
      formData.value.body = "";
      formData.value.themePostId = null;
      message.success("Пост добавлен!");
    } else {
      message.error("Ошибка добавления поста!");
    }
  } catch (err) {
    message.error("Ошибка валидации!");
  }
};
</script>

<style scoped></style>
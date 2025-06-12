<template>
  <div>
    <n-layout has-sider style="height: 100vh">
      <n-layout-sider
        bordered
        width="200"
        style="position: fixed; height: 100vh; left: 0; top: 0"
        :collapsed="collapsed"
        show-trigger
        @update:collapsed="collapsed = $event"
      >
        <n-menu :options="menuOptions" v-model:value="selectedKey" />
      </n-layout-sider>

      <n-layout-content
        :style="{
          marginLeft: collapsed ? '48px' : '200px',
          padding: '0',
          height: '100vh',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }"
      >
        <div
          style="
            height: 100%;
            overflow-y: auto;
            padding: 16px;
            box-sizing: border-box;
          "
        >
          <div
            style="
              display: flex;
              align-items: center;
              gap: 16px;
              margin-bottom: 16px;
              justify-content: space-between;
            "
          >
            <div style="display: flex; align-items: center; gap: 16px">
              <div @click="themeStore.toggleTheme" style="cursor: pointer">
                <component
                  :is="themeStore.theme === 'dark' ? Sunny : Moon"
                  style="width: 28px; height: 28px; color: currentColor"
                />
              </div>

              <div @click="toSettings" style="cursor: pointer">
                <component
                  :is="Settings"
                  style="width: 28px; height: 28px; color: currentColor"
                />
              </div>
              <n-button type="primary" @click="toUserPosts">Ваши посты</n-button>
            </div>

            <div>
              <n-button @click="logOut" type="error"> Выйти </n-button>
            </div>
          </div>

          <div
            style="
              display: flex;
              gap: 16px;
              margin-bottom: 16px;
              flex-wrap: wrap;
            "
          >
            <n-input
              v-model:value="postStore.searchQuery"
              placeholder="Поиск..."
              clearable
              style="flex: 1"
            />
            <n-select
              placeholder="Сортировка"
              style="width: 180px"
              v-model:value="postStore.sortKey"
              :options="[
                { label: 'Дата', value: 'date' },
                { label: 'Заголовок', value: 'title' },
                { label: 'Автор', value: 'username' },
                { label: 'Лайки', value: 'likes' },
                { label: 'Дизлайки', value: 'dislikes' },
              ]"
            />
            <n-select
              v-model:value="postStore.sortDirection"
              style="width: 180px"
              :options="[
                { label: 'По возрастанию', value: 'asc' },
                { label: 'По убыванию', value: 'desc' },
              ]"
            />
          </div>

          <div
            style="
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
              gap: 16px;
            "
          >
            <n-card
              v-for="post in postStore.filteredAndSortedPosts"
              :key="post.id"
              size="medium"
              hoverable
              style="
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 100%;
              "
              @click="toPost(post.id)"
            >
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <n-text strong style="font-size: 16px">{{ post.title }}</n-text>
                <n-text depth="3" style="font-size: 12px">{{
                  dateStore.formatDate(post.createdAt)
                }}</n-text>
              </div>

              <n-text depth="2" style="margin: 8px 0">
                {{
                  post.body.length > 100
                    ? post.body.slice(0, 100) + "..."
                    : post.body
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
                <n-text>{{ post.username }}</n-text>
                <div style="display: flex; align-items: center; gap: 8px">
                  <n-button text @click.stop="react(post.id, 'like')">
                    <component
                      :is="getLikeIcon(post.id)"
                      style="width: 24px; height: 24px"
                      :style="{ color: getReactionColor(post.id, 'like') }"
                    />
                  </n-button>
                  <n-text>{{
                    reactionStore.getReactions(post.id).likes
                  }}</n-text>

                  <n-button text @click.stop="react(post.id, 'dislike')">
                    <component
                      :is="getDislikeIcon(post.id)"
                      style="width: 24px; height: 24px"
                      :style="{ color: getReactionColor(post.id, 'dislike') }"
                    />
                  </n-button>
                  <n-text>{{
                    reactionStore.getReactions(post.id).dislikes
                  }}</n-text>
                </div>
              </div>
            </n-card>
          </div>

          <div
            style="height: 1px; width: 100%"
            ref="observerTarget"
            class="observer"
            @click="console.log(postStore.posts)"
          ></div>
          <div
            v-if="postStore.loading"
            style="text-align: center; margin: 16px"
          >
            <n-spin type="circle" />
          </div>
        </div>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import {
  NButton,
  NModal,
  NText,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NFlex,
  useMessage,
  NLayout,
  NLayoutSider,
  NLayoutContent,
  NMenu,
  NCard,
  NSpin,
} from "naive-ui";
import { useThemePostStore } from "../store/useThemePostStore";
import { useUserStore } from "../store/useUserStore";
import { usePostStore } from "../store/usePostStore";
import {
  Moon,
  Sunny,
  Settings,
  Heart,
  HeartDislike,
  HeartOutline,
  HeartDislikeOutline,
} from "@vicons/ionicons5";
import { useThemeStore } from "../store/useThemeStore";
import { useRouter } from "vue-router";
import { useDateStore } from "../store/useDateStore";
import { useReactionStore } from "../store/useReactionStore";
import { useIntersectionObserver } from "@vueuse/core";

const message = useMessage();
const themePostStore = useThemePostStore();
const userStore = useUserStore();
const postStore = usePostStore();
const themeStore = useThemeStore();
const dateStore = useDateStore();
const reactionStore = useReactionStore();
const router = useRouter();

const observerTarget = ref(null);
const stopObserver = ref(null);

const collapsed = ref(false);
const selectedKey = ref("0");

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

const toPost = (postId) => {
  if (!postId) {
    console.error("postId is missing!");
    return;
  }
  router.push({ name: "Post", params: { id: postId } });
};

const logOut = () => {
  router.push("/");
  userStore.user = null;
};

const toUserPosts = () => {
  router.push(`/user/${userStore.user.id}`);
};

const toSettings = () => {
  router.push(`/settings/user/${userStore.user.id}`);
};

const fetchThemePosts = async () => {
  try {
    await themePostStore.fetchThemePosts();
    menuOptions.value = [
      { label: "Все", key: 0 },
      ...themePostStore.themePosts.map((theme) => ({
        label: theme.name,
        key: theme.id,
      })),
    ];
  } catch (e) {
    message.error("Не удалось загрузить темы", e);
  }
};

const menuOptions = ref([]);

watch(selectedKey, async (newVal) => {
  console.log("selectedKey changed:", newVal);
  await postStore.resetAndFetch(newVal);
});

const loadMore = async () => {
  await postStore.loadMore();
};

watch(observerTarget, (el) => {
  if (stopObserver.value) stopObserver.value();

  if (!el) return;

  stopObserver.value = useIntersectionObserver(
    el,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        loadMore();
      }
    },
    {
      threshold: 0.1,
    }
  ).stop;
});

onMounted(async () => {
  await fetchThemePosts();
  await postStore.resetAndFetch(selectedKey.value);
});
</script>

<style scoped></style>
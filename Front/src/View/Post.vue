<template>
  <div
    style="display: flex; justify-content: flex-end; padding: 16px 16px 0px 0px"
  >
    <n-button @click="router.push('/home')">Назад</n-button>
  </div>

  <div v-if="post" style="padding: 24px; max-width: 800px; margin: 0 auto">
    <n-card>
      <div
        style="
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          color: #888;
          font-size: 14px;
        "
      >
        <span>{{ post.username }}</span>
        <span>{{ dateStore.formatDate(post.createdAt) }}</span>
      </div>

      <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 16px">
        {{ post.title }}
      </h1>

      <div style="font-size: 16px; margin-bottom: 24px">
        {{ post.body }}
      </div>

      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
        "
      >
        <div style="display: flex; gap: 8px; font-size: 14px">
          <div style="display: flex; align-items: center; gap: 8px">
            <n-button text @click.stop="reactPost(post.id, 'like')">
              <component
                :is="getLikeIcon(post.id)"
                style="width: 24px; height: 24px"
                :style="{ color: getReactionColor(post.id, 'like') }"
              />
            </n-button>
            <n-text>{{ reactionStore.getReactions(post.id).likes }}</n-text>

            <n-button text @click.stop="reactPost(post.id, 'dislike')">
              <component
                :is="getDislikeIcon(post.id)"
                style="width: 24px; height: 24px"
                :style="{ color: getReactionColor(post.id, 'dislike') }"
              />
            </n-button>
            <n-text>{{ reactionStore.getReactions(post.id).dislikes }}</n-text>
          </div>
        </div>
        <n-button
          type="error"
          secondary
          size="small"
          @click="deletePost"
          v-if="post.userId === userStore.user.id"
        >
          Удалить
        </n-button>
      </div>
    </n-card>
    <n-card style="padding: 8px 12px; margin-bottom: 12px">
      <div style="display: flex; align-items: flex-start; gap: 8px">
        <n-input
          v-model:value="body"
          placeholder="Напишите комментарий..."
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 3 }"
          style="flex: 1"
          size="small"
        />
        <n-button
          type="primary"
          size="small"
          @click="AddComment"
          style="white-space: nowrap; height: 32px"
        >
          Отправить
        </n-button>
      </div>
    </n-card>

    <n-card
      v-for="comment in commentStore.postComments"
      :key="comment.id"
      style="margin-bottom: 16px"
    >
      <div
        style="
          display: flex;
          justify-content: space-between;
          color: #888;
          font-size: 13px;
          margin-bottom: 8px;
        "
      >
        <span>{{ comment.username }}</span>
        <span>{{ dateStore.formatDate(comment.createdAt) }}</span>
      </div>

      <div style="font-size: 15px; margin-bottom: 12px">
        {{ comment.body }}
      </div>

      <div
        style="
          display: flex;
          gap: 8px;
          font-size: 14px;
          justify-content: space-between;
        "
      >
        <div style="display: flex; align-items: center; gap: 8px">
          <n-button text @click.stop="reactComment(comment.id, 'like')">
            <component
              :is="getLikeIcon(comment.id)"
              style="width: 24px; height: 24px"
              :style="{ color: getReactionColor(comment.id, 'like') }"
            />
          </n-button>
          <n-text>{{ reactionStore.getReactions(comment.id).likes }}</n-text>

          <n-button text @click.stop="reactComment(comment.id, 'dislike')">
            <component
              :is="getDislikeIcon(comment.id)"
              style="width: 24px; height: 24px"
              :style="{ color: getReactionColor(comment.id, 'dislike') }"
            />
          </n-button>
          <n-text>{{ reactionStore.getReactions(comment.id).dislikes }}</n-text>
        </div>
        <n-button
          type="error"
          secondary
          size="small"
          @click="deleteComment(comment.id)"
          v-if="comment.userId == userStore.user.id"
        >
          Удалить
        </n-button>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { NText, NCard, NButton, useMessage, NInput } from "naive-ui";
import { usePostStore } from "../store/usePostStore";
import { useCommentStore } from "../store/useCommentStore";
import { useUserStore } from "../store/useUserStore";
import Comment from "../models/Comment";
import { useDateStore } from "../store/useDateStore";
import {
  Heart,
  HeartDislike,
  HeartOutline,
  HeartDislikeOutline,
} from "@vicons/ionicons5";
import { useReactionStore } from "../store/useReactionStore";

const userStore = useUserStore();
const postStore = usePostStore();
const commentStore = useCommentStore();
const route = useRoute();
const router = useRouter();
const message = useMessage();
const postId = route.params.id;
const dateStore = useDateStore();
const reactionStore = useReactionStore();

const post = ref(null);
const body = ref("");

const loadPostAndComments = async () => {
  post.value = await postStore.fetchOnePost(Number(postId));
  console.log(post.value);

  await commentStore.fetchPostComments(Number(postId));
};

const AddComment = async () => {
  const comment = new Comment({
    body: body.value,
    userId: userStore.user.id,
    postId: postId,
  });
  const success = await commentStore.addComment(comment);
  if (success) {
    await loadPostAndComments();
    body.value = "";
    message.success("Комментарий добавлен");
  } else {
    message.error("Ошибка добавления комментария");
  }
};

const reactComment = async (commentId, type) => {
  const res = await reactionStore.toggleReaction({ commentId, type });
  if (res) {
    await reactionStore.fetchReactionsForComments(
      [commentId],
      userStore.user.id
    );
  }
};

const reactPost = async (postId, type) => {
  const res = await reactionStore.toggleReaction({ postId, type });
  if (res) {
    await reactionStore.fetchReactionsForPosts([postId], userStore.user.id);
  }
};

const getLikeIcon = (commentId) => {
  const reaction = reactionStore.getReactions(commentId).userReaction;
  return reaction === "like" ? Heart : HeartOutline;
};

const getDislikeIcon = (commentId) => {
  const reaction = reactionStore.getReactions(commentId).userReaction;
  return reaction === "dislike" ? HeartDislike : HeartDislikeOutline;
};

const getReactionColor = (commentId, type) => {
  const current = reactionStore.getReactions(commentId).userReaction;
  if (current === type) {
    return type === "like" ? "#ff4d4f" : "#8c8c8c";
  }
  return "#aaa";
};

const deletePost = async () => {
  const success = await postStore.deletePost(postId);
  if (success) {
    message.success("Пост удален");
    router.push("/home");
  } else {
    message.error("Ошибка удаления");
  }
};

const deleteComment = async (commentId) => {
  const success = await commentStore.deleteComment(commentId);
  if (success) {
    message.success("Комментарий удален");
    await loadPostAndComments();
  } else {
    message.error("Ошибка удаления");
  }
};

onMounted(async () => {
  await loadPostAndComments();
});
</script>

<style scoped></style>
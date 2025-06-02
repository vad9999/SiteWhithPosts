<template>
    <n-button @click="AddComment" type="primary">
        Написать комментарий
    </n-button>
    <n-card>
        <n-form>
            <n-form-item>
                {{ post }}
            </n-form-item>

            <n-form-item v-for="comment in commentStore.postComments">
                {{ comment }}
            </n-form-item>

            <n-form-item>
                <n-input v-model:value="body"></n-input>
                <n-button @click="AddComment">Написать комментарий</n-button>
            </n-form-item>
        </n-form>
    </n-card>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { NText, NCard, NForm, NFormItem, NButton, useMessage, NInput } from 'naive-ui'
    import { usePostStore } from '../store/usePostStore'
    import { useCommentStore } from '../store/useCommentStore'
    import { useUserStore } from '../store/useUserStore'
    import Comment from '../models/Comment'

    const userStore = useUserStore()
    const postStore = usePostStore()
    const commentStore = useCommentStore()
    const route = useRoute()
    const message = useMessage()
    const postId = route.params.id

    const post = ref(null)
    const body = ref('')

    const loadPostAndComments = async () => {
        post.value = await postStore.fetchOnePost(Number(postId))
        console.log(post.value)

        await commentStore.fetchPostComments(Number(postId))
    }

    const AddComment = async () => {
        const comment = new Comment({
            body: body.value,
            userId: userStore.user.id,
            postId: postId
        })
        const success = await commentStore.addComment(comment)
        if(success) {
            await loadPostAndComments()
            message.success('Комментарий добавлен')
        } else {
            message.error('Ошибка добавления комментария')
        }
    }
    
    onMounted(async () => {
        await loadPostAndComments()
    })
</script>

<style scoped>

</style>
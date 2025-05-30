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
        </n-form>
    </n-card>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { NText, NCard, NForm, NFormItem, NButton, useMessage } from 'naive-ui'
    import { usePostStore } from '../store/usePostStore'
    import { useCommentStore } from '../store/useCommentStore'
    import { Comment } from '../models/Comment'

    const postStore = usePostStore()
    const commentStore = useCommentStore()
    const route = useRoute()
    const message = useMessage()
    const postId = route.params.id

    const post = ref(null)

    const loadPostAndComments = async () => {
        post.value = await postStore.fetchOnePost(Number(postId))
        console.log(post.value)

        await commentStore.fetchPostComments(Number(postId))
    }

    const AddComment = async () => {
        const comment = new Comment({

        })
        const success = await commentStore.AddComment(comment)
        if(success) {
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
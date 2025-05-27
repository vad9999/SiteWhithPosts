<template>
  <div>
    <n-layout has-sider style="height: 100vh;">
    <n-layout-sider
      bordered
      width="200"
      style="position: fixed; height: 100vh; left: 0; top: 0;"
      :collapsed="collapsed"
      show-trigger
      @update:collapsed="collapsed = $event"
    >
      <n-menu
        :options="menuOptions"
        v-model:value="selectedKey"
      />
    </n-layout-sider>

    <n-layout-content
      style="margin-left: 200px; padding: 16px; overflow-y: auto; height: 100vh;"
      :style="{ marginLeft: collapsed ? '48px' : '200px' }"
    >
      <!-- <n-button @click="collapsed = !collapsed" style="margin-bottom: 16px;">
        {{ collapsed ? 'Развернуть меню' : 'Свернуть меню' }}
      </n-button> -->

      <h2>Выбран пункт: {{ selectedKey }}</h2>
      <n-button type="primary" @click="loadThemePost" style="right: 0; top: 0;">Добавить</n-button>
    </n-layout-content>
  </n-layout>

    <n-modal v-model:show="showModal" title="Добавить пост" preset="dialog" :closable="false">
      <n-form :model="formData" :rules="rules" ref="formRef">
        <n-form-item label="Название" path="title">
            <n-input v-model:value="formData.title" placeholder="Введите название" />
        </n-form-item>

        <n-form-item label="Описание" path="body">
            <n-input v-model:value="formData.body" placeholder="Введите описание" type="textarea"/>
        </n-form-item>

        <n-form-item label="Тема" path="themePostId">
            <n-select v-if="themeOptions.length" v-model:value="formData.themePostId" :options="themeOptions" placeholder="Выберите тему"/>
        </n-form-item>
        <n-flex style="justify-content: space-between;">
            <n-button @click="showModal = false">Отмена</n-button>
            <n-button type="primary" @click="submitForm">Сохранить</n-button>
        </n-flex>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { NButton, NModal, NForm, NFormItem, NInput, NSelect, NFlex, useMessage, NLayout, NLayoutSider, NLayoutContent, NMenu } from 'naive-ui'
    import { useThemePostStore } from '../store/useThemePostStore'
    import { useUserStore } from '../store/useUserStore'
    import { usePostStore } from '../store/usePostStore'
    import Post from '../models/Post'

    const message = useMessage()
    const themePostStore = useThemePostStore()
    const userStore = useUserStore()
    const postStore = usePostStore()

    const themeOptions = ref([])
    

    const collapsed = ref(false)
    const selectedKey = ref('1')

    const menuOptions = ref([])

    onMounted(async () => {
        try {
            await themePostStore.fetchThemePosts()
            menuOptions.value = [{label: 'Все', key: 0}, ...themePostStore.themePosts.map(theme => ({
            label: theme.name,    
            key: theme.id
            }))]
        } catch (e) {
            message.error('Не удалось загрузить темы', e)
        }
    })

    const showModal = ref(false)
    const formData = ref({
        title: '',
        body: '',
        themePostId: null
    })

    const formRef = ref(null)

    const rules = {
        title: [{ required: true, message: 'Введите название', trigger: 'blur' }],
        body: [{ required: true, message: 'Введите описание', trigger: 'blur' }],
        themePostId: [{ required: true, type: 'number', message: 'Выберите тему', trigger: 'change' }]
    }

    const loadThemePost = async () => {
        showModal.value = true
        await themePostStore.fetchThemePosts()
        themeOptions.value = themePostStore.themePosts.map(theme => ({
            label: theme.name,    
            value: theme.id
        }))
    }

    const submitForm = async () => {
        try {
            await formRef.value?.validate()

            const post = new Post({
                title: formData.value.title,
                body: formData.value.body,
                themePostId: formData.value.themePostId,
                userId: userStore.user.id
            })

            const success = await postStore.addPost(post)
            if (success) {
                showModal.value = false
                formData.value.title = ''
                formData.value.body = ''
                formData.value.themePostId = null
                message.success('Пост добавлен!')
            } else {
                message.error('Ошибка добавления поста!')
            }
        } catch (err) {
            message.error('Ошибка валидации!')
        }
    }
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh; /* Высота равна высоте окна */
  overflow: hidden;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh; /* Высота всей страницы */
  z-index: 1000;
  /* background: white; Чтобы не просвечивал контент */
  box-shadow: 2px 0 6px rgb(0 0 0 / 0.1);
}

.content {
  margin-left: 200px; /* Ширина сайдбара */
  padding: 16px;
  overflow-y: auto;
  height: 100vh;
  width: 100%;
  box-sizing: border-box;
}

.sidebar.n-layout-sider--collapsed + .content {
  margin-left: 48px; /* Ширина свернутого сайдбара */
}  

</style>
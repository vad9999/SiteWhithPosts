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
			:style="{
				marginLeft: collapsed ? '48px' : '200px',
				padding: '0',
				height: '100vh',
				overflow: 'hidden',
				boxSizing: 'border-box'
			}"
			>
				<div style="height: 100%; overflow-y: auto; padding: 16px; box-sizing: border-box;">
					<div @click="themeStore.toggleTheme" style="width: 40px; height: 40px;">
						<component :is="themeStore.theme === 'dark' ? Sunny : Moon" 
						style="width: 40px; height: 40px; color: currentColor;"/>
					</div>

					<div @click="toSettings" style="width: 40px; height: 40px;">
						<component :is="Settings" style="width: 40px; height: 40px; color: currentColor;"/>
					</div>

					<h2>Выбран пункт: {{ selectedKey }}</h2>
					<n-button type="primary" @click="loadThemePost" style="right: 0; top: 0;">Добавить</n-button>
					<n-button type="primary" @click="toUserPosts">Ваши посты</n-button>
					<n-input v-model:value="postStore.searchQuery" placeholder="Поиск..." clearable/>
					<n-select 
					placeholder="Сортировка"
					v-model:value="postStore.sortKey"
					:options="[
    				{ label: 'Дата', value: 'date' },
    				{ label: 'Заголовок', value: 'title' },
    				{ label: 'Автор', value: 'username' }
  					]"
					/>
					<n-select
					v-model:value="postStore.sortDirection"
					:options="[
						{ label: 'По возрастанию', value: 'asc' },
						{ label: 'По убыванию', value: 'desc' }
					]"
					/>
					<n-card
					v-for="post in postStore.filteredAndSortedPosts"
					:key="post.id"
					:title="post.title"
					size="medium"
					hoverable
					style="margin-bottom: 16px"
					@click="toPost(post.id)"
					>
						<template #header-extra>
							<n-text depth="3">{{ dateStore.formatDate(post.createdAt) }}</n-text>
						</template>
						<n-text depth="2">
						{{ post.body.length > 100 ? post.body.slice(0, 100) + '...' : post.body }}
						</n-text>
						<template #footer>
							<n-text>{{ post.username }}</n-text>
						</template>

						<n-button @click.stop="like({ postId: post.id, type: 'like'})">
							<component :is="Heart" style="width: 40px; height: 40px; color: currentColor;"/>
						</n-button>

						<n-button @click.stop="dislike({ postId: post.id, type: 'dislike'})">
							<component :is="HeartDislike" style="width: 40px; height: 40px; color: currentColor;"/>
						</n-button>

						<n-text>
							👍 {{ reactionStore.getReactions(post.id).likes }} |
					👎 		{{ reactionStore.getReactions(post.id).dislikes }} |
							Вы поставили: {{ reactionStore.getReactions(post.id).userReaction || 'ничего' }}
						</n-text>
  					</n-card>
            		<div style="background: red; height: 30px; width: 100%;" ref="observerTarget" class="observer" @click="console.log(postStore.posts)"></div>
					<!-- <div v-if="postStore.loading" style="text-align: center; margin: 16px;">
      					<n-spinner type="circle" />
    				</div> -->
				</div>
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
    import { ref, onMounted, watch } from 'vue'
    import { NButton, NModal, NText, NForm, NFormItem, NInput, NSelect, NFlex, useMessage, NLayout, NLayoutSider, NLayoutContent, NMenu, NCard } from 'naive-ui'
    import { useThemePostStore } from '../store/useThemePostStore'
    import { useUserStore } from '../store/useUserStore'
    import { usePostStore } from '../store/usePostStore'
    import Post from '../models/Post'
    import { Moon, Sunny, Settings, ThumbsUp, ThumbsDown, Heart, HeartDislike } from '@vicons/ionicons5'
	import { useThemeStore} from '../store/useThemeStore'
	import { useRouter } from 'vue-router'
	import { useDateStore } from '../store/useDateStore'
    import { useReactionStore } from '../store/useReactionStore'
	import { useIntersectionObserver } from '@vueuse/core'

    const message = useMessage()
    const themePostStore = useThemePostStore()
    const userStore = useUserStore()
    const postStore = usePostStore()
	const themeStore = useThemeStore()
	const dateStore = useDateStore()
    const reactionStore = useReactionStore()
	const router = useRouter()

    const themeOptions = ref([])
	const observerTarget = ref(null)

	const collapsed = ref(false)
    const selectedKey = ref('0')
	const page = ref(1)
	const limit = 10
	const hasMore = ref(true)

	const like = async (data) => {
        const success = await reactionStore.toggleReaction(data)
        console.log(success)
	}

	const dislike = async (data) => {
        const success = await reactionStore.toggleReaction(data)
        console.log(success)
	}

	const toPost = (postId) => {
		if (!postId) {
			console.error('postId is missing!')
			return
		}
		router.push({ name: 'Post', params: { id: postId } })
	}

    const toUserPosts = () => {
		router.push(`/user/${userStore.user.id}`)
	}

	const toSettings = () => {
		router.push(`/settings/user/${userStore.user.id}`)
	}

    const SortedPosts = async () => {
		console.log('Смена темы:', selectedKey.value)
		page.value = 1
		postStore.posts = []
		hasMore.value = true

		const success = await postStore.fetchPosts(Number(selectedKey.value), page.value, limit)
		if (success) {
			message.success('Посты загружены')
			page.value++
		} else {
			message.error('Ошибка загрузки постов')
		}
	}

	const loadMorePosts = async () => {
		if (!hasMore.value) return
		const result = await postStore.fetchPosts(selectedKey.value, page.value, limit)
		if (result === false) return
		page.value++
		hasMore.value = result
	}


	const fetchThemePosts = async () => {
		try {
            await themePostStore.fetchThemePosts()
            menuOptions.value = [{label: 'Все', key: 0}, ...themePostStore.themePosts.map(theme => ({
            label: theme.name,    
            key: theme.id
            }))]
        } catch (e) {
            message.error('Не удалось загрузить темы', e)
        }
	}

    const menuOptions = ref([])

	watch(selectedKey, async (newVal) => {
		//await SortedPosts()
		postStore.resetAndFetch(newVal)
	})

	const loadMore = async () => {
		await postStore.loadMore()
	}

	useIntersectionObserver(observerTarget, ([{ isIntersecting }]) => {
		if (isIntersecting) {
			loadMore()
		}
	}, {
		threshold: 0.1
	})

	onMounted(async () => {
		await fetchThemePosts()
		postStore.resetAndFetch(selectedKey.value)
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
			//await SortedPosts()
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

</style>
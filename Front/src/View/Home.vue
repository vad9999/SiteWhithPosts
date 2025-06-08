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
					<div style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
						<!-- <div @click="themeStore.toggleTheme" style="width: 40px; height: 40px;"> -->
						<div @click="themeStore.toggleTheme" style="cursor: pointer;">
							<component :is="themeStore.theme === 'dark' ? Sunny : Moon" 
							style="width: 28px; height: 28px; color: currentColor;"/>
						</div>

						<div @click="toSettings" style="cursor: pointer;">
							<component :is="Settings" style="width: 28px; height: 28px; color: currentColor;"/>
						</div>
						<!-- style="right: 0; top: 0;" -->
						<n-button type="primary" @click="loadThemePost">Добавить</n-button>
						<n-button type="primary" @click="toUserPosts">Ваши посты</n-button>
					</div>
					<div style="display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap;">
						<n-input v-model:value="postStore.searchQuery" placeholder="Поиск..." clearable style="flex: 1;"/>
						<n-select 
						placeholder="Сортировка"
						style="width: 180px;"
						v-model:value="postStore.sortKey"
						:options="[
							{ label: 'Дата', value: 'date' },
							{ label: 'Заголовок', value: 'title' },
							{ label: 'Автор', value: 'username' },
							{ label: 'Лайки', value: 'likes' },
							{ label: 'Дизлайки', value: 'dislikes' }
						]"
						/>
						<n-select
						v-model:value="postStore.sortDirection"
						style="width: 180px;"
						:options="[
							{ label: 'По возрастанию', value: 'asc' },
							{ label: 'По убыванию', value: 'desc' }
						]"
						/>
					</div>
					<!-- style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;" -->
					<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;">
						<!--:title="post.title" display: flex; flex-direction: column; justify-content: space-between; height: 100%; -->
						<n-card
						v-for="post in postStore.filteredAndSortedPosts"
						:key="post.id"
						
						size="medium"
						hoverable
						style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;"
						@click="toPost(post.id)"
						>
							<div style="display: flex; justify-content: space-between; align-items: center;">
								<n-text strong style="font-size: 16px;">{{ post.title }}</n-text>
								<n-text depth="3" style="font-size: 12px;">{{ dateStore.formatDate(post.createdAt) }}</n-text>
							</div>

							<n-text depth="2" style="margin: 8px 0;">
								{{ post.body.length > 100 ? post.body.slice(0, 100) + '...' : post.body }}
							</n-text>

							<div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
								<n-text>{{ post.username }}</n-text>
								<div style="display: flex; align-items: center; gap: 8px;">
								<n-button text @click.stop="react(post.id, 'like')">
									<component
									:is="getLikeIcon(post.id)"
									style="width: 24px; height: 24px;"
									:style="{ color: getReactionColor(post.id, 'like') }"
									/>
								</n-button>
								<n-text>{{ reactionStore.getReactions(post.id).likes }}</n-text>

								<n-button text @click.stop="react(post.id, 'dislike')">
									<component
									:is="getDislikeIcon(post.id)"
									style="width: 24px; height: 24px;"
									:style="{ color: getReactionColor(post.id, 'dislike') }"
									/>
								</n-button>
								<n-text>{{ reactionStore.getReactions(post.id).dislikes }}</n-text>
								</div>
							</div>
						</n-card>
					</div>
					
            		<div style="background: red; height: 30px; width: 100%;" ref="observerTarget" class="observer" @click="console.log(postStore.posts)"></div>
					<div v-if="postStore.loading" style="text-align: center; margin: 16px;">
						<n-spin type="circle" />
					</div>
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
    import { ref, onMounted, watch, nextTick } from 'vue'
    import { NButton, NModal, NText, NForm, NFormItem, NInput, NSelect, NFlex, useMessage, NLayout, NLayoutSider, NLayoutContent, NMenu, NCard, NSpin } from 'naive-ui'
    import { useThemePostStore } from '../store/useThemePostStore'
    import { useUserStore } from '../store/useUserStore'
    import { usePostStore } from '../store/usePostStore'
    import Post from '../models/Post'
    import { Moon, Sunny, Settings, Heart, HeartDislike, HeartOutline, HeartDislikeOutline } from '@vicons/ionicons5'
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
	const stopObserver = ref(null)


	const collapsed = ref(false)
    const selectedKey = ref('0')

	const react = async (postId, type) => {
		const res = await reactionStore.toggleReaction({ postId, type })
		if (res) {
			await reactionStore.fetchReactionsForPosts([postId], userStore.user.id)
		}
	}

	const getLikeIcon = (postId) => {
		const reaction = reactionStore.getReactions(postId).userReaction
		return reaction === 'like' ? Heart : HeartOutline
	}

	const getDislikeIcon = (postId) => {
		const reaction = reactionStore.getReactions(postId).userReaction
		return reaction === 'dislike' ? HeartDislike : HeartDislikeOutline
	}

	const getReactionColor = (postId, type) => {
		const current = reactionStore.getReactions(postId).userReaction
		if (current === type) {
			return type === 'like' ? '#ff4d4f' : '#8c8c8c'
		}
		return '#aaa'
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
		console.log('selectedKey changed:', newVal)
		await postStore.resetAndFetch(newVal)
	})

	const loadMore = async () => {
		await postStore.loadMore()
	}

	watch(observerTarget, (el) => {
		if (stopObserver.value) stopObserver.value()

		if (!el) return

		stopObserver.value = useIntersectionObserver(
			el,
			([{ isIntersecting }]) => {
				if (isIntersecting) {
					loadMore()
				}
			},
			{
				threshold: 0.1,
			}
		).stop 
	})

	onMounted(async () => {
		await fetchThemePosts()
		await postStore.resetAndFetch(selectedKey.value)
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
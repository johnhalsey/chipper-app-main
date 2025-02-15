import {find, uniq, get} from 'lodash-es'

export const useUser = defineStore('user', () => {
	const {$api} = useNuxtApp()

	const {getCookieParams} = useHelpers()

	const started = ref(false)

	const data = ref({})

	const token = ref(null)

	const tokenCookie = useCookie('jwt', getCookieParams())

	const isGuest = computed(() => !Object.keys(data.value).length)

	const name = computed(() => isGuest.value ? null : data.value.name)

	async function start (payload) {
		started.value = true
		data.value = payload.data
		token.value = payload.token

		// Write cookie
		tokenCookie.value = payload.token
	}

	function clear () {
		data.value = {}
		token.value = null
		tokenCookie.value = null
	}

	async function login ({email, password}) {
		const payload = await $api.post('/login', {email, password})
		start(payload)
	}

	async function register ({name, email, password}) {
		const payload = await $api.post('/register', {
			name,
			email,
			password,
			password_confirmation: password
		})

		start(payload)
	}

	async function validate () {
		// Skip if the browser does not have a "jwt" cookie or the session has already started
		if (!tokenCookie.value || started.value) return

		try {
			const payload = await $api.get('/session')
			start(payload)
		} catch (e) {
			clear()
		}
	}

	async function logout () {
		await $api.post('/logout')
		clear()
	}

	const favorites = reactive({
		users: [],
		posts: []
	})

	async function fetchFavorites () {
		if (!tokenCookie.value) return
		await $api.get('/favorites')
				.then(response => {
					favorites.users = response.data.users
					favorites.posts = response.data.posts
				})
	}

	async function addFavoriteUser (id) {
		await $api.post('/users/' + id + '/favorite')
				.then(() => {
					fetchFavorites()
				})
	}

	async function removeFavoriteUser (id) {
		await $api.delete('/users/' + id + '/favorite')
				.then(() => {
					fetchFavorites()
				})
	}

	async function addFavoritePost (id) {
		await $api.post('/posts/' + id + '/favorite')
				.then(() => {
					fetchFavorites()
				})
	}

	async function removeFavoritePost (id) {
		await $api.delete('/posts/' + id + '/favorite')
				.then(() => {
					fetchFavorites()
				})
	}

	return {
		started,
		data,
		token,
		isGuest,
		name,
		favorites,
		login,
		register,
		validate,
		logout,
		fetchFavorites,
		addFavoriteUser,
		removeFavoriteUser,
		addFavoritePost,
		removeFavoritePost
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot))
}

export const usePost = defineStore('post', () => {

	const { $api } = useNuxtApp()

	async function create({title, body}) {
		await $api.post('/posts', {
			title: title,
			body: body
		})
	}

	return {
		create
	}

})

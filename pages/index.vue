<script setup>
definePageMeta({
	middleware: ['validate-session']
})

const {$api} = useNuxtApp()
const user = useUser()
const posts = ref([])
const polledPosts = ref([])
const showNewPostsButton = ref(false)

await $api.get('posts')
		.then((response) => {
			posts.value = response.data
		})

// check for new posts every 30 seconds
setInterval(async () => {
	await $api.get('posts')
			.then((response) => {
				polledPosts.value = response.data

				if (polledPosts.value.length > posts.value.length) {
					showNewPostsButton.value = true
				}
			})
}, 30000)

function loadNewPosts () {
	posts.value = polledPosts.value
	showNewPostsButton.value = false
}

user.fetchFavorites()
</script>

<template>
	<button v-if="showNewPostsButton"
					class="bg-blue-600 text-white px-8 py-4 rounded-lg w-full mb-4"
					@click="loadNewPosts"
	>
		Load New Posts
	</button>

	<PostForm v-if="!user.isGuest"/>

	<div class="grid gap-16">
		<PostItem
				v-for="post in posts"
				:key="post.id"
				v-bind="{ post }"/>
	</div>
</template>

<script setup>
import {HeartIcon} from '@heroicons/vue/24/outline'

const user = useUser()

const props = defineProps({
	post: {
		type: Object,
		required: true
	}
})

const isFavoriteUser = computed(() => {
	return user.favorites.users.length &&
	user.favorites.users.filter(favorite => favorite.id === props.post.user.id).length ? true : false
})

const isFavoritePost = computed(() => {
	return user.favorites.posts.length &&
	user.favorites.posts.filter(favorite => favorite.id === props.post.id).length ? true : false
})

async function toggleFavoriteUser () {
	if (isFavoriteUser.value) {
		await user.removeFavoriteUser(props.post.user.id)
	} else {
		await user.addFavoriteUser(props.post.user.id)
	}
}

async function toggleFavoritePost () {
	if (isFavoritePost.value) {
		await user.removeFavoritePost(props.post.id)
	} else {
		await user.addFavoritePost(props.post.id)
	}
}
</script>

<template>
	<div class="grid gap-3">
		<h4 class="font-bold text-lg">
			{{ post.title }}
		</h4>
		<div class="flex justify-between bg-gray-100 p-4 rounded-lg">
			<div>
				by <strong>{{ post.user.name }}</strong>
			</div>
			<button v-if="user.data.id !== post.user.id"
							class="font-medium bg-blue-200 text-sm px-2 rounded-full"
							@click="toggleFavoriteUser"
			>
        <span v-if="isFavoriteUser">
					Unfollow
				</span>
				<span v-else>
					Follow
				</span>

			</button>
		</div>
		<p>
			{{ post.body }}
		</p>
		<button class="bg-red-200 text-red-500 flex items-center justify-center gap-2 p-4 rounded-lg"
						@click="toggleFavoritePost"
		>
			<HeartIcon
					class="h-6 stroke-current"
					:class="{'fill-current': isFavoritePost}"
			/>
			<span v-if="isFavoritePost"
						class="font-bold">
        Remove from my favorites
      </span>
			<span v-else>
					Add to my favorites
				</span>
		</button>
	</div>
</template>

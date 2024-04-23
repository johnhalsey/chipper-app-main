<script setup>

const post = usePost()

const title = ref('')
const body = ref('')

async function submit () {
	try {
		await post.create({
			title: title.value,
			body: body.value
		})
		clearForm()
	} catch (e) {
		console.error(e)
	}

}

function clearForm () {
	title.value = ''
	body.value = ''
}
</script>

<template>
	<form
			class="grid gap-4 mb-16"
			@submit.prevent="submit">
		<input
				v-model="title"
				placeholder="Post title"
				class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base">
		<textarea
				v-model="body"
				placeholder="What is happening?!"
				class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base"></textarea>
		<button class="bg-blue-600 text-white px-8 py-4 rounded-lg"
		>
			Post
		</button>
	</form>
</template>

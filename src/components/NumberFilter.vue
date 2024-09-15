<template>
	<v-sheet class="d-flex flex-wrap">
		<h6 class="mt-2 text-subtitle-1">{{ title }}</h6>
	</v-sheet>

	<v-sheet class="d-flex flex-wrap">
		<v-responsive max-width="110">
			<v-text-field label="最小" v-model="minVal" type="number"
				@input="searchTrigerFunc" @click:clear="clearTriggerFunc" hide-details></v-text-field>
		</v-responsive>

		<v-label class="ml-1 mr-2 mt-2 text-body-2">から</v-label>

		<v-responsive max-width="110">
			<v-text-field label="最大" v-model="maxVal" type="number"
				@input="searchTrigerFunc" @click:clear="clearTriggerFunc" hide-details></v-text-field>
		</v-responsive>

		<v-label class="ml-1 mt-2 text-body-2">まで</v-label>
	</v-sheet>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  searchTrigerFunc: () => void
  clearTriggerFunc: () => void
}>()

const minVal = defineModel<string>('min')
const maxVal = defineModel<string>('max')
</script>

<style scoped></style>
<template>
	<v-card
		:subtitle="title"
		variant="flat"
	>
		<v-row justify="center">
			<v-col cols="5">
				<v-text-field
				label="最小"
				v-model="minVal"
				type="number"
				@input="searchTrigerFunc"
				@click:clear="clearTriggerFunc"
				clearable
				hide-details
				></v-text-field>
			</v-col>

			<v-col cols="auto" class="d-flex align-center">～</v-col>

			<v-col cols="5">
				<v-text-field
				label="最大"
				v-model="maxVal"
				type="number"
				@input="searchTrigerFunc"
				@click:clear="clearTriggerFunc"
				clearable
				hide-details
				></v-text-field>
			</v-col>
		</v-row>
	</v-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  searchTrigerFunc: () => void
  clearTriggerFunc: () => void
}>()

const minVal = defineModel('min')
const maxVal = defineModel('max')
</script>

<style scoped></style>
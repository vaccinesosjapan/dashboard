<template>
	<v-card
		:subtitle="title"
		variant="flat"
	>
		<v-row justify="center">
			<v-col cols="5">
				<v-text-field
				label="開始日"
				v-model="startVal"
				type="date"
				@input="searchTrigerFunc"
				@click:clear="clearTriggerFunc"
				clearable
				hide-details
				></v-text-field>
			</v-col>

			<v-col cols="auto" class="d-flex align-center">～</v-col>

			<v-col cols="5">
				<v-text-field
				label="終了日"
				v-model="endVal"
				type="date"
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

const startVal = defineModel('start')
const endVal = defineModel('end')
</script>

<style scoped></style>
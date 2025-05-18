<template>
	<div v-if="flag">
		<v-chip color="deep-orange-accent-4" label>あり</v-chip>
	</div>
	<div v-else>
		<span>なし</span>
	</div>
</template>

<script setup lang="ts">
defineProps<{
  flag: boolean
}>()
</script>
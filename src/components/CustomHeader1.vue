/* 
  md以上: h4サイズ
  md以下: h5かつ下線
*/
<template>
	<h1 class="d-none d-md-flex text-h4 mb-2">{{ title }}</h1>
  <h1 class="d-flex d-md-none text-h5 underline mb-2">{{ title }}</h1>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style scoped>
.underline{
  text-underline-offset: 0.25rem;
  text-decoration-line: underline;
  text-decoration-color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  text-decoration-thickness: 1.5px;
}
</style>
/* 
  md以上: h5サイズ
  md以下: h6かつ下線
*/
<template>
	<h2 class="d-none d-md-flex text-h5 mb-2">{{ title }}</h2>
  <h2 class="d-flex d-md-none text-h6 underline mb-2">{{ title }}</h2>
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
  text-decoration-style: dashed;
  text-decoration-color: #E65100;
  text-decoration-thickness: 2px;
}
</style>
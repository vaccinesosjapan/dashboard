/* 
  md以上: h4サイズ
  md以下: h5サイズ
*/
<template>
	<h1 class="d-none d-md-flex text-h4 justify-center mb-2">{{ title }}</h1>
  <h1 class="d-flex d-md-none text-h5 justify-center mb-2">{{ title }}</h1>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style scoped>
h1 {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border-radius: 15px;
}
</style>
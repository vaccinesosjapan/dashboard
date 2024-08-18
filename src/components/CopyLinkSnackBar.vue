<template>
	<v-snackbar :timeout="2000" color="blue-grey-darken-3">
		<template v-slot:activator="{ props }">
		<v-btn class="mb-1" size="x-small" prepend-icon="mdi-link-variant" variant="outlined" @click="copyLink(id, position)" v-bind="props">コピー</v-btn>
		</template>
		クリップボードにリンクURLをコピーしました!
	</v-snackbar>	
</template>

<script setup lang="ts">
defineProps<{
  id: string
  position: string
}>()

import router from '@/router/index'

const copyLink = (id: string, position: string) => {
  let linkUrl = window.location.origin + import.meta.env.BASE_URL + '#' + router.currentRoute.value.path + '?anchor=' + id + '&position=' + position
  if (navigator.clipboard) {
    navigator.clipboard.writeText(linkUrl);
  }
}
</script>

<style scoped></style>
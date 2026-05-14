<template>
	<v-select
		v-model="values"
		:items="items"
		:label="label"
		item-title="display_name"
		item-value="value"
		@update:model-value="searchTriggerFunc"
		hide-details="auto"
		multiple
		>
		<template v-slot:prepend-item>
			<v-list-item>
				<template v-slot:prepend>
					<v-btn @click="()=>{ 
						values = []
						clearTriggerFunc()
					}">全て選択解除</v-btn>
					<slot name="help"></slot>
				</template>
				
			</v-list-item>
			
			<v-divider class="mt-2"></v-divider>
		</template>

		<template v-slot:selection="{ item, index }">
			<v-chip v-if="index < 2">
				<span>{{ item.title }}</span>
			</v-chip>
			<div v-if="index === 2" class="text-grey text-caption align-self-center">
				<span v-if="values == undefined">
					(+ その他)
				</span>
				<span v-else>
					(+{{ values.length - 2 }} その他)
				</span>
			</div>
		</template>
	</v-select>
</template>

<script setup lang="ts">
import type { SelectItem } from '@/types/SelectItem';

defineProps<{
  label: string
  searchTriggerFunc: () => void
  clearTriggerFunc: () => void
}>()

const values = defineModel<number[]>('values')
const items = defineModel<SelectItem[]>('items')
</script>

<style scoped></style>
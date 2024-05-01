<template>
	<v-select
		v-model="values"
		:items="items"
		:label="label"
		multiple
		@update:model-value="searchTrigerFunc"
		:item-props="itemProps"
		hide-details="auto"
		>
		<template v-slot:prepend-item>
			<v-list-item>
				<v-list-item-title>
					<v-text-field
						v-model="searchText"
						placeholder="表示項目の絞り込み"
						@input="searchFunc"
						@click:clear="clearSearchText"
						clearable
						hide-details
					></v-text-field>
				</v-list-item-title>
			</v-list-item>
			<v-list-item>
				<template v-slot:prepend>
					<v-btn class="mr-2"
					 @click="()=>{
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
				<span v-if="item.title == ''">（記載なし）</span>
				<span v-else>{{ item.title }}</span>
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
import { onMounted, shallowRef } from 'vue';

defineProps<{
  label: string
  searchTrigerFunc: () => void
  clearTriggerFunc: () => void
}>()

const values = defineModel<string[]>('values')
const items = defineModel<string[]>('items')

const itemProps = (item: any) => {
        return item == '' ? {
			title: '（記載なし）',
        } : {
			title: item,
		}
}

const searchText = shallowRef<string>('')
const itemsCopy = shallowRef<string[]>([])
const searchFunc = () => {
	items.value = itemsCopy.value.filter((item) => {
		return item.toLowerCase().indexOf(searchText.value.toLowerCase()) > -1;
	});
}
const clearSearchText = () => {
	items.value = itemsCopy.value
}

onMounted(() => {
	if(items.value != undefined){
		itemsCopy.value = [...items.value]
	}
})
</script>

<style scoped></style>
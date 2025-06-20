<template>
	<a :href="url">{{ ordinalNumber }}</a> {{ carditisType }}No.{{ issue_number }}
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';

const ordinalNumber = shallowRef<string>()
const carditisType = shallowRef<string>()

const props = defineProps<{
	url: string
	issue_number: number
	id: string
}>()

const infoTuple = extractInfoFromId(props.id)
ordinalNumber.value = infoTuple[0]
carditisType.value = infoTuple[1]
</script>

<script lang="ts">
const extractInfoFromId = (id: string) : [string, string] =>{
	const split = id.split('-')

	const ordinalNumber = '第' + split[0] + '回'
	const carditisType = extractCarditisType(split[1])
	// 元データでNoが「####」のようになっているデータがあり、ID生成の都合上
	// split[2]は「X00001」などに変換されている場合があるため、元のNoである
	// issueNumberの方を使う。

	return [ordinalNumber, carditisType]
}

const extractCarditisType = (desc: string) :string => {
	switch (desc) {
		case 'myocarditis':
			return '心筋炎の '
		case 'pericarditis':
			return '心膜炎の '
	
		default:
			return ''
	}
}
</script>

<style lang="css" scoped>
</style>
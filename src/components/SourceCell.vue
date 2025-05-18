<template>
	<a :href="url">{{ ordinalNumber }}</a> {{ severity }}{{ issueNumber }}
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';

const ordinalNumber = shallowRef<string>()
const severity = shallowRef<string>()
const issueNumber = shallowRef<string>()

const props = defineProps<{
	id: string
	url: string
}>()

const infoTuple = extractInfoFromId(props.id)
ordinalNumber.value = infoTuple[0]
severity.value = infoTuple[1]
issueNumber.value = infoTuple[2]
</script>

<script lang="ts">
const extractInfoFromId = (id: string) : [string, string, string] =>{
	const split = id.split('-')

	const ordinalNumber = '第' + split[0].replace('th', '回')
	const severity = extractSeverity(split[1])
	const number = 'No.' + split[2]

	return [ordinalNumber, severity, number]
}

const extractSeverity = (desc: string) :string => {
	switch (desc) {
		case 'MIS':
			return '重篤症例一覧の '
		case 'MIN':
			return '非重篤症例一覧の '
	
		default:
			return ''
	}
}
</script>

<style lang="css" scoped>
</style>
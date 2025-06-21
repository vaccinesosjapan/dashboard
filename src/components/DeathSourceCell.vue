<template>
	<a :href="url">{{ ordinalNumber }}</a> {{ vaccineName }} の No.{{ issueNumber }}
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';

const ordinalNumber = shallowRef<string>()
const vaccineName = shallowRef<string>()
const issueNumber = shallowRef<string>()

const props = defineProps<{
	url: string
	id: string
}>()

const infoTuple = extractInfoFromId(props.id)
ordinalNumber.value = infoTuple[0]
vaccineName.value = infoTuple[1]
issueNumber.value = infoTuple[2]
</script>

<script lang="ts">
const extractInfoFromId = (id: string) : [string, string, string] =>{
	const split = id.split('-')

	const ordinalNumber = '第' + split[0] + '回'
	const vaccineName = split[1]
	const issueNumber = split[2]

	return [ordinalNumber, vaccineName, issueNumber]
}
</script>

<style lang="css" scoped>
</style>
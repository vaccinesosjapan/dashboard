<template>
	<v-row justify="center" class="d-none d-sm-flex mt-3">
		<v-col cols="12" md="3" sm="4">
			<v-select :items="dates" v-model="selectedDate" :label="label" hide-details="auto">
				<template v-slot:prepend-item>
					<v-text-field
						v-model="searchText"
						placeholder="選択肢を絞り込み"
						@input="searchFunc"
						@click:clear="clearSearchText"
						clearable
						hide-details
						class="mx-1"
					></v-text-field>
				</template>
			</v-select>
		</v-col>
		<v-col cols="12" md="4" sm="5">
			<v-btn @click="openIssues">審議会データを確認する</v-btn>
		</v-col>
	</v-row>

	<v-row justify="center" class="d-flex d-sm-none">
		<v-col cols="12">
			<v-select :items="dates" v-model="selectedDate" :label="label" hide-details="auto">
				<template v-slot:prepend-item>
					<v-text-field
						v-model="searchText"
						placeholder="選択肢を絞り込み"
						@input="searchFunc"
						@click:clear="clearSearchText"
						clearable
						hide-details
						class="mx-1"
					></v-text-field>
				</template>
			</v-select>
			<v-btn @click="openIssues" class="mt-1">審議会データを確認する</v-btn>
		</v-col>
	</v-row>

	<v-snackbar v-model="snackbarActivator" :timeout="timeout" color="warning">
      データを表示したい審議会の日付を選択してください。
    </v-snackbar>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue';
import router from '@/router/index'

defineProps<{
}>()

const dates = defineModel<string[]>('dates')

const selectedDate = shallowRef<string>('')
const label = shallowRef<string>('日付選択')

const openIssues = () =>{
	if(selectedDate.value == ''){
		snackbarActivator.value = true
		return
	}
	router.push({ path: 'certified-issues', query: { jdf: selectedDate.value } })
}

const snackbarActivator = shallowRef<boolean>(false)
const timeout = 2000

const searchText = shallowRef<string>('')
const datesCopy = shallowRef<string[]>([])
const searchFunc = () => {
	dates.value = datesCopy.value.filter((item) => {
		return item.toLowerCase().indexOf(searchText.value.toLowerCase()) > -1;
	});
}
const clearSearchText = () => {
	dates.value = datesCopy.value
}

onMounted(() => {
	if(dates.value != undefined){
		datesCopy.value = [...dates.value]
	}
})
</script>

<style scoped>
</style>
<template>
	<apexchart @mounted="mountedFunc" :options="options" :series="series"></apexchart>

	<v-sheet v-if="seriesNames == undefined">
    <v-progress-circular color="primary" indeterminate :size="100" :width="10"></v-progress-circular>
  </v-sheet>

  <v-card v-else subtitle="表示項目を選択" variant="outlined">
    <template v-slot:text>
      <div class="d-flex flex-wrap">
        <div v-for="(seriesName, i) in seriesNames" :key="i" class="mr-5">
          <label :for="`series-check-${i}`" class="checkbox-label" @click="toggleLegend(i)">
            <input type="checkbox" checked :style="getColor(i)" :id="`series-check-${i}`" :value="seriesName" 
              v-model="checkNames" @update:model-value="toggleLegend(i)">
          {{ seriesName }}</label>
        </div>
      </div>
    </template>
  </v-card>

</template>

<script setup lang="ts">
import { shallowRef } from 'vue';

defineProps<{
  options: any
  series: any
}>()

const chartInstance = shallowRef<any>()
const seriesNames = shallowRef<string[]>()
const checkNames = shallowRef<string[]>()
const barColors = shallowRef<string[]>()

const mountedFunc = (chart: any) => {
  chartInstance.value = chart

  const names: string[] = []
  for (let index = 0; index < chart.opts.series.length; index++) {
	const seriesName = chart.opts.series[index].name
	names.push(seriesName)
  }
  seriesNames.value = names
  checkNames.value = names

  barColors.value = chart.theme.colors
}

const getColor = (index: number): string =>{
	if(barColors.value === undefined) return ''

  let color: string = ''
	if( index < barColors.value.length ) {
		color = barColors.value[index]
	} else {
		color = barColors.value[index % barColors.value.length]
	}

  return `accent-color: ${color};`
}

const toggleLegend = (index: number) => {
  if(chartInstance.value === undefined || seriesNames.value === undefined) return
  chartInstance.value.toggleSeries(seriesNames.value[index])
}
</script>

<style scoped>
input[type=checkbox]{
  vertical-align: -1px;
}

label, input[type='checkbox'] {
  cursor: pointer;
}

.checkbox-label {
  font-size: 1rem;
}

.compact-col {
  padding-top: 1px;
  padding-bottom: 0px;
}
</style>

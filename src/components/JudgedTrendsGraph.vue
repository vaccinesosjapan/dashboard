<template>

  <v-sheet class="d-block d-md-none">
    <apexchart height="400" :options="shortChartOption" :series="[{data: series}]"></apexchart>
  </v-sheet>

  <v-sheet class="d-none d-md-block">
    <apexchart height="400" :options="mediumChartOption" :series="[{data: series}]"></apexchart>
  </v-sheet>

</template>

<script setup lang="ts">
import { shallowRef } from 'vue';

const props = defineProps<{
  title: string
  series: {x: string, y: number}[]
}>()

const numberFormatter = (value: any) => { return value.toLocaleString() }
const issueFormatter = (value: any) => { return value.toLocaleString() + ' 件' }
const createBaseChartOption = (title: string): any =>{
  return {
    title: {
      text: title,
      align: 'center',
      offsetY: 20,
    },
    chart: {
      type: 'bar',
    },
    xaxis: {
      title: {
        text: '認定件数'
      },
	  labels: {
		formatter: numberFormatter
	  },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '0.8rem'
        },
        offsetY: 5,
        maxWidth: 250
      }
    },
    tooltip: {
      y: {
        formatter: issueFormatter,
        title: {
			formatter: (): string => {
				return '認定件数: '
			}
		}
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      formatter: issueFormatter
    }
  }
}

const mediumChartOption = shallowRef<any>()
mediumChartOption.value = createBaseChartOption(props.title)

const shortChartOption = shallowRef<any>()
const sChartOp = createBaseChartOption(props.title)
sChartOp.dataLabels.style = {
	fontSize: '0.7rem',
	colors: ['#818181'],
}
sChartOp.dataLabels.background = {
	enabled: true,
	foreColor: '#fff',
}
sChartOp.dataLabels.offsetX = 35
sChartOp.dataLabels.offsetY = 6
sChartOp.xaxis.tickAmount = 3
shortChartOption.value = sChartOp
</script>

<style scoped>

</style>

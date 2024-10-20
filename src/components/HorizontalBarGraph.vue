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
  graphTitle: string[]
  xAxisTitle: string
  series: {x: string, y: number}[]
  downloadFileName: string
}>()

const mediumChartOption = shallowRef<any>()
mediumChartOption.value = createBaseChartOption(props.graphTitle, props.xAxisTitle, props.downloadFileName)

const shortChartOption = shallowRef<any>()
const sChartOp = createBaseChartOption(props.graphTitle, props.xAxisTitle, props.downloadFileName)
sChartOp.dataLabels.style = {
	fontSize: '0.9rem',
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

<script lang="ts">
const numberFormatter = (value: any) => { return value.toLocaleString() }
const issueFormatter = (value: any) => { return value.toLocaleString() + ' 件' }
const createBaseChartOption = (graphTitle: string[], xAxisTitle: string, downloadFileName: string): any =>{
  return {
    title: {
      text: graphTitle,
      align: 'center',
      offsetY: 20,
    },
    chart: {
      type: 'bar',
      toolbar:{
        export: {
          csv: {
            filename: downloadFileName,
          },
          svg: {
            filename: downloadFileName,
          },
          png: {
            filename: downloadFileName,
          }
        },
      }
    },
    xaxis: {
      title: {
        text: xAxisTitle
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
				return `${xAxisTitle}: `
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
</script>

<style scoped></style>

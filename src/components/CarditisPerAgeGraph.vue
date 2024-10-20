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

defineProps<{
  series: {x: string, y: number}[]
}>()

const mediumChartOption = shallowRef<any>()
const mChartOp = createBaseChartOption()
mChartOp.dataLabels.style = {
	fontSize: '0.9rem',
	colors: ['#818181'],
}
mChartOp.dataLabels.background = {
	enabled: true,
	foreColor: '#fff',
}
mChartOp.dataLabels.offsetX = 35
mChartOp.dataLabels.offsetY = 6
mediumChartOption.value = mChartOp

const shortChartOption = shallowRef<any>()
const sChartOp = createBaseChartOption()
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
const downloadFileName = 'carditis-per-age-graph'

const numberFormatter = (value: any) => { return value.toLocaleString() }
const issueFormatter = (value: any) => { return value.toLocaleString() + ' 人' }
const createBaseChartOption = (): any =>{
  return {
    title: {
      text: '心筋炎/心膜炎になった方々の人数（年代別）',
	    floating: true
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
	  colors: ['#c83f3d'],
    xaxis: {
      title: {
        text: '人数'
      },
      labels: {
        formatter: numberFormatter
      },
    },
    yaxis: {
      title: {
        text: '年代'
      },
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
				    return `人数: `
			    }
		    }
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
		    borderRadius: 2
      },
    },
    dataLabels: {
      formatter: issueFormatter
    }
  }
}
</script>

<style scoped></style>

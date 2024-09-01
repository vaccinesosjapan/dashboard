<template>
  <v-row class="d-none d-md-flex mt-3">
    <v-col cols="12">
      <apexchart :options="eachCountAndRateChartOption" :series="eachCountAndRateSeries" ></apexchart>
    </v-col>
  </v-row>

  <v-row class="d-flex d-md-none">
    <v-col cols="12">
      <v-img :src="eachAltImagePath"></v-img>
    </v-col>
    <v-col cols="12">
      <p class="text-caption text-right">※ グラフを画像で表示しています。詳しいデータを見れるグラフは、横幅 960 px以上のPC画面などでご覧ください。</p>
    </v-col>
  </v-row>

  <v-row class="d-none d-md-flex mt-3">
    <v-col cols="12">
      <apexchart :options="allCountAndRateChartOption" :series="allCountAndRateSeries" ></apexchart>
    </v-col>
  </v-row>

  <v-row class="d-flex d-md-none">
    <v-col cols="12">
      <v-img :src="allAltImagePath"></v-img>
    </v-col>
    <v-col cols="12">
      <p class="text-caption text-right">※ グラフを画像で表示しています。詳しいデータを見れるグラフは、横幅 960 px以上のPC画面などでご覧ください。</p>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { IJudgedData, IJudgedDataGraphInfo } from '@/types/JudgedData';
import { shallowRef } from 'vue';

const props = defineProps<{
  data: IJudgedData[]
  eachInfo: IJudgedDataGraphInfo
  allInfo: IJudgedDataGraphInfo
  eachAltImagePath: string
  allAltImagePath: string
}>()

interface ISeriesValue {
	name: string,
	type: string,
	data: number[]
}

const xAxisLabels = shallowRef<string[]>([])
const numberOfCertified :number[] = []
const numberOfRepudiation :number[] = []
const numberOfCertifiedRate :number[] = []
const numberOfCertifiedSum :number[] = []
const numberOfRepudiationSum :number[] = []
const numberOfCertifiedRateSum :number[] = []

// グラフ部品のためのデータ型を再構築しているが、そもそものデータ型を見直した方が良いかも。
for (let index = 0; index < props.data.length; index++) {
	const element = props.data[index];

	xAxisLabels.value.push(element.Date)
	numberOfCertified.push(element.CertifiedCount)
	numberOfRepudiation.push(element.RepudiationCount)
	numberOfCertifiedRate.push(element.CertifiedRate)
	numberOfCertifiedSum.push(element.CertifiedCountSum)
	numberOfRepudiationSum.push(element.RepudiationCountSum)
	numberOfCertifiedRateSum.push(element.CertifiedRateSum)
}

// Seriesデータを作成
const eachCountAndRateSeries = shallowRef<ISeriesValue[]>([])
const allCountAndRateSeries = shallowRef<ISeriesValue[]>([])

eachCountAndRateSeries.value = [
	{
		name: props.eachInfo.RepudiationSeriesName,
		type: 'bar',
		data: numberOfRepudiation
	},
	{
		name: props.eachInfo.CertifiedSeriesName,
		type: 'bar',
		data: numberOfCertified
	},
	{
		name: props.eachInfo.RateSeriesName,
		type: 'line',
		data: numberOfCertifiedRate
	},
]

allCountAndRateSeries.value = [
	{
		name: props.allInfo.RepudiationSeriesName,
		type: 'bar',
		data: numberOfRepudiationSum
	},
	{
		name: props.allInfo.CertifiedSeriesName,
		type: 'bar',
		data: numberOfCertifiedSum
	},
	{
		name: props.allInfo.RateSeriesName,
		type: 'line',
		data: numberOfCertifiedRateSum
	},
]

// グラフ描画オプションを作成
const eachCountAndRateChartOption = shallowRef<any>()
const allCountAndRateChartOption = shallowRef<any>()

const xAxisTitle = '審議会の開催日'
const CreateCountAndRateChartOption = (info: IJudgedDataGraphInfo, labels: string[]): any =>{
  return {
    chart: {
      type: 'line',
      stacked: true,
      toolbar: {
        export: {
          csv: {
            headerCategory: xAxisTitle,
            headerValue: 'value',
            categoryFormatter(x: any) {
              return new Date(x).toDateString()
            }
          }
        }
      }
    },
    stroke: {
      width: 5
    },
    title: {
      text: info.GraphTitle,
      style: {
        fontSize: '1.2rem',
        colors: ['#212121'],
      },
      offsetY: 20
    },
    tooltip: {
    y: {
        formatter: function(value: any, { series, seriesIndex, dataPointIndex, w } :any) {
          if(w.config.series[seriesIndex].name == info.RateSeriesName){
            return (value as number).toFixed(1) + ' %'
          } else {
            return (value as number).toLocaleString() + ' 件'
          }
        }
      },
    },
    labels: labels,
    xaxis: {
      type: 'category',
      title: {
        text: xAxisTitle,
        offsetY: -25,
        style: {
          fontSize: '1rem',
          colors: ['#212121'],
        },
      }
    },
    yaxis: [
      {
        seriesName: [info.RepudiationSeriesName, info.CertifiedSeriesName],
        labels: {
          formatter: function (value: any) {
            return value.toLocaleString()
          },
          style: {
            colors: ['#E83938'],
          }
        },
        max: info.CountYAxisMax
      },
      {
        seriesName: [info.RepudiationSeriesName, info.CertifiedSeriesName],
        title: {
          text: info.CountTitle,
          style: {
            fontSize: '1rem',
            color: '#6CAF52',
          },
        },
        labels: {
          formatter: function (value: any) {
            return value.toLocaleString()
          },
          style: {
            colors: ['#6CAF52'],
          }
        },
        max: info.CountYAxisMax,
      },
      {
        seriesName: info.RateSeriesName,
        opposite: true,
        title: {
          text: info.RateTitle,
          style: {
            fontSize: '1rem',
            color: '#7560CF',
          },
        },
        min: 0,
        max: 100.0,
        labels: {
          formatter: function (value: any) {
            return value.toFixed(1)
          },
          style: {
            colors: ['#7560CF'],
          }
        },
      }
    ],
    colors: ['#E83938', '#6CAF52', '#7560CF'],
    legend: {
      fontSize: '14',
    }
  }
}

eachCountAndRateChartOption.value = CreateCountAndRateChartOption(props.eachInfo, xAxisLabels.value)
allCountAndRateChartOption.value = CreateCountAndRateChartOption(props.allInfo, xAxisLabels.value)
</script>

<style scoped></style>
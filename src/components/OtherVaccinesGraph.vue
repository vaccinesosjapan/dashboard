/*
  md（横幅 960 px）以上の画面サイズでは、apexchartsを使ったグラフ表示を行う。
  上記よりも小さい画面サイズでは「傾向を示すグラフ画像」を表示しつつ、請求内容
  ごとのデータを別々のグラフに描画する。
*/
<template>

  <v-sheet class="d-block d-md-none">
    <v-img :src="thumbnailImagePath"></v-img>
    <p class="text-caption text-right">{{ noticeForImage }}</p>

    <apexchart class="mt-4" :options="medicalChartOption" :series="[{data: medicalValues}]"></apexchart>
    <apexchart class="mt-2" :options="disabilityOfChildrenChartOption" :series="[{data: disabilityOfChildrenValues}]"></apexchart>
    <apexchart class="mt-2" :options="disabilityChartOption" :series="[{data: disabilityValues}]"></apexchart>
    <apexchart class="mt-2" :options="deathChartOption" :series="[{data: deathValues}]"></apexchart>
  </v-sheet>

  <v-sheet class="d-none d-md-block">
    <apexchart @onmounted="updateFuncAll" @updated="updateFuncAll" :options="allChartOption" :series="allSeries"></apexchart>

    <v-sheet v-if="allSeriesNames == undefined">
      <v-progress-circular color="primary" indeterminate :size="100" :width="10"></v-progress-circular>
    </v-sheet>

    <v-card v-else subtitle="表示項目を選択" variant="outlined">
      <template v-slot:text>
        <div class="d-flex flex-wrap justify-center">
          <div v-for="(seriesName, i) in allSeriesNames" :key="i" class="mr-5">
            <label :for="`series-check-${i}`" class="text-body-2 text-md-subtitle-1">
              <input type="checkbox" class="check check-md" checked :style="getColorAll(i)" :id="`series-check-${i}`" :value="seriesName" 
                v-model="allCheckNames" @update:model-value="toggleLegendAll(i)">
            {{ seriesName }}</label>
          </div>
        </div>
      </template>
    </v-card>
  </v-sheet>

</template>

<script setup lang="ts">
import type { ICertifiedSummaryWithOtherVaccines } from '@/types/CertifiedSummary';
import { shallowRef } from 'vue';

const props = defineProps<{
  summayData: ICertifiedSummaryWithOtherVaccines
  thumbnailImagePath: string
}>()

const allChartInstance = shallowRef<any>()
const allSeriesNames = shallowRef<string[]>()
const allCheckNames = shallowRef<string[]>()
const allBarColors = shallowRef<string[]>()

const [categories, allSeries, headerNames, medicalValues, disabilityOfChildrenValues, disabilityValues, deathValues] = ExtractSomeCertifiedSummaryArray(props.summayData)
const allChartOption = CreateAllCertifiedChartOption(['新型コロナワクチンと', '過去の各種ワクチンの認定件数まとめ'], categories, true)
const medicalChartOption = CreateEachBillingDetailsChartOption('medical', [`${headerNames[0]} の認定件数まとめ`], '#3393FA', categories, false)
const disabilityOfChildrenChartOption = CreateEachBillingDetailsChartOption('children', [`${headerNames[1]} の認定件数まとめ`], '#54E496', categories, false)
const disabilityChartOption = CreateEachBillingDetailsChartOption('disability', [`${headerNames[2]} の認定件数まとめ`], '#F6AD21', categories, false)
const header4Array = headerNames[3].split('・')
const deathChartOption = CreateEachBillingDetailsChartOption('death', [`${header4Array.slice(0,2).join('、')}`,`${header4Array.slice(2,4).join('、')} の認定件数まとめ`], '#F23B61', categories, false)

const updateFuncAll = (chart: any) => {
  if(allChartInstance.value !== undefined) return ''

  allChartInstance.value = chart

  const names: string[] = []
  for (let index = 0; index < chart.opts.series.length; index++) {
    const seriesName = chart.opts.series[index].name
    names.push(seriesName)
  }
  allSeriesNames.value = names
  allCheckNames.value = names

  allBarColors.value = chart.theme.colors
}

const getColorAll = (index: number): string =>{
	if(allBarColors.value === undefined) return ''

  let color: string = ''
	if( index < allBarColors.value.length ) {
		color = allBarColors.value[index]
	} else {
		color = allBarColors.value[index % allBarColors.value.length]
	}

  return `accent-color: ${color};`
}

const toggleLegendAll = (index: number) => {
  if(allChartInstance.value === undefined || allSeriesNames.value === undefined) return
  allChartInstance.value.toggleSeries(allSeriesNames.value[index])
}
</script>

<script lang="ts">
// apexchartsに渡す際のSeriesデータ型
interface StackedBarSeries {
	name: string
	data: number[]
}

const noticeForImage = '※ グラフを画像で表示しています。詳しいデータを見る場合は、横幅 960 px以上のPC画面などでご覧ください。'

const CreateFileName = (id: string): string => {
	return `certified-summary-with-other-vaccines-${id}`
}

// datasetから取得した「過去の各種ワクチン」と「新型コロナワクチン」の認定件数まとめデータから
// apexchartsに渡す各種データを抽出する関数。
const ExtractSomeCertifiedSummaryArray = (summayData: ICertifiedSummaryWithOtherVaccines):
 [string[], StackedBarSeries[], string[], number[], number[], number[], number[]] => {
	const categories: string[] = []

	const medicalValues: number[] = []
	const disabilityOfChildrenValues: number[] = []
	const disabilityValues: number[] = []
	const deathValues: number[] = []

	for (let index = 0; index < summayData.chart_data.data.length; index++) {
		const chartData = summayData.chart_data.data[index]
		categories.push(chartData.vaccine_name)

		medicalValues.push(chartData.medical)
		disabilityOfChildrenValues.push(chartData.disability_of_children)
		disabilityValues.push(chartData.disability)
		deathValues.push(chartData.death)
	}
	
	const header1 = summayData.chart_data.headers[1];
	const header2 = summayData.chart_data.headers[2];
	const header3 = summayData.chart_data.headers[3];
	const header4 = summayData.chart_data.headers[4];
	const headerNames = [header1, header2, header3, header4]

	const allSeries: StackedBarSeries[] = []
	allSeries.push({ name: header1, data: medicalValues })
	allSeries.push({ name: header2, data: disabilityOfChildrenValues })
	allSeries.push({ name: header3, data: disabilityValues })
	allSeries.push({ name: header4, data: deathValues })

	return [categories, allSeries, headerNames, medicalValues, disabilityOfChildrenValues, disabilityValues, deathValues]
}

const numberFormatter = (value: any) => { return value.toLocaleString() }
const issueFormatter = (value: any) => { return value.toLocaleString() + ' 件' }
const createBaseChartOption = (id: string): any => {
		return {
			title: {
			text: [''],
			align: 'center',
			offsetY: 10,
		},
		chart: {
			type: 'bar',
			stacked: false,
			toolbar:{
				export: {
					csv: {
						headerCategory: 'ワクチン名',
						filename: CreateFileName(id),
					},
					svg: {
						filename: CreateFileName(id),
					},
					png: {
						filename: CreateFileName(id),
					}
				},
			}
		},
		legend: {
			show: false
		},
		tooltip: {
			y: {
				formatter: issueFormatter
			},
		},
		responsive: [{
			breakpoint: 800,
			options: {
				chart: {
					height: 800
				}
			}
		}],
		plotOptions: {
			bar: {
				horizontal: true,
			},
		},
		xaxis: {
			categories: [''],
			labels: {
				formatter: numberFormatter
			},
		},
		stroke: {
			width: 1,
			colors: ['#fff']
		},
		dataLabels: {
			formatter: issueFormatter
		}
	}
}

const CreateAllCertifiedChartOption = (title: string[], categories: string[], isStacked: boolean): any => {
	const chartOption = createBaseChartOption('all')

	chartOption.title.text = title
	chartOption.xaxis.categories = categories
	chartOption.chart.stacked = isStacked

	return chartOption
}

const CreateEachBillingDetailsChartOption = (id:string, title: string[], barColor: string, categories: string[], isStacked: boolean): any => {
	const chartOption = createBaseChartOption(id)

	chartOption.title.text = title
	chartOption.colors = [barColor]
	chartOption.xaxis.tickAmount = 3
	chartOption.xaxis.categories = categories
	chartOption.chart.stacked = isStacked

	chartOption.dataLabels.style = {
		fontSize: '0.7rem',
		colors: ['#818181'],
	}
	chartOption.dataLabels.background = {
		enabled: true,
		foreColor: '#fff',
	}
	chartOption.dataLabels.offsetX = 35
	chartOption.dataLabels.offsetY = 6

	return chartOption
}
</script>

<style scoped>
.check {
  vertical-align: -2px;
  margin-right: -3px;
  transform: scale(1) !important;
}

@media (min-width: 960px) {
  .check-md {
    vertical-align: -1px;
    margin-right: -1px;
    transform: scale(1.4) !important;
  }
}

label, input[type='checkbox'] {
  cursor: pointer;
}

.checkbox-label {
  font-size: 1rem;
}
</style>

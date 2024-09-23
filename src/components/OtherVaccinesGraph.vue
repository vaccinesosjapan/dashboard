/*
  md（横幅 960 px）以上の画面サイズでは、apexchartsを使ったグラフ表示を行う。
  上記よりも小さい画面サイズでは、傾向を示すグラフ画像の表示と、「過去の各種ワクチン」
  「新型コロナワクチン」それぞれのデータを別々のグラフに描画する。
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
import { CreateAllCertifiedChartOption, CreateEachBillingDetailsChartOption, ExtractSomeCertifiedSummaryArray} from '@/tools/CertifiedSummary';
import type { ICertifiedSummaryWithOtherVaccines } from '@/types/CertifiedSummary';
import { shallowRef } from 'vue';

const noticeForImage = '※ グラフを画像で表示しています。詳しいデータを見る場合は、横幅 960 px以上のPC画面などでご覧ください。'

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
const medicalChartOption = CreateEachBillingDetailsChartOption([`${headerNames[0]} の認定件数まとめ`], '#3393FA', categories, false)
const disabilityOfChildrenChartOption = CreateEachBillingDetailsChartOption([`${headerNames[1]} の認定件数まとめ`], '#54E496', categories, false)
const disabilityChartOption = CreateEachBillingDetailsChartOption([`${headerNames[2]} の認定件数まとめ`], '#F6AD21', categories, false)
const header4Array = headerNames[3].split('・')
const deathChartOption = CreateEachBillingDetailsChartOption([`${header4Array.slice(0,2)}`,`${header4Array.slice(2,4)} の認定件数まとめ`], '#F23B61', categories, false)

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

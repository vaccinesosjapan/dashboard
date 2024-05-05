<template>
  <v-container fluid>

    <v-container v-if="medicalInstitutionSummary == undefined">
      <v-progress-circular
        color="primary"
        indeterminate
        :size="100"
        :width="10"
      ></v-progress-circular>
    </v-container>

    <v-container v-else>
      <h4 class="text-h4">副反応疑い報告</h4>
      <p>
        予防接種法により医療機関から報告された事例 <b>{{ medicalInstitutionSummary?.medical_institution_summary_from_reports.total_count.toLocaleString() }} [件]</b> の集計結果を示します。
      </p>

      <div class="d-flex justify-end">
        <v-btn size="small" @click="changeChartView" color="blue" v-if="isPersentView">件数を表示</v-btn>
        <v-btn size="small" @click="changeChartView" color="blue" v-else>割合を表示</v-btn>
      </div>

      <v-row>
        <v-col cols="12" sm="6">
          <apexchart :options="causalRelationshipOptions" :series="causalRelationshipSeries"></apexchart>
        </v-col>

        <v-col cols="12" sm="6">
          <apexchart :options="severityOptions" :series="severitySeries"></apexchart>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6">
          <apexchart height="400" :options="lotNumberOptions" :series="[{data: lotNumberSeries}]"></apexchart>
          <p class="text-caption text-right">※ ロットNoが不明または空白の報告は <b>{{ medicalInstitutionSummary?.medical_institution_summary_from_reports.lot_no_info.invalid_count.toLocaleString() }}</b> 件で、上記はそれらを除いた集計結果です。</p>
        </v-col>

        <v-col cols="12" sm="6">
          <p class="text-body-1 mb-5">
            以下の一覧でロットNoを選択すると、報告一覧に対してそのロットNoを含む報告のみを表示できます。
          </p>
          <ol class="pl-10">
            <li v-for="(lotno_data, i) in lotNumberTopTenList" :key="i" class="mb-2">
              <a :href="createUrl(lotno_data.lot_no)" target="_blank"><b>{{ lotno_data.lot_no }}</b></a> ( 製造販売業者: {{ lotno_data.manufacturer }} )
            </li>
          </ol>
          <p class="text-caption text-left mt-4">※ 左上の集計数は対象のロットNoのみ接種した報告の数です。報告一覧では同時接種したワクチンなどを含む報告も表示されるため、件数が異なる場合があります。</p>
        </v-col>
      </v-row>

      <br>
      <p class="text-caption text-right">※ このページは <b>{{ medicalInstitutionSummary?.medical_institution_summary_from_reports.date }}</b> 時点までの報告内容に基づいた集計結果を表示しています。</p>
    </v-container>

  </v-container>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import axios from 'axios'
import { AppBarTitle, AppBarColor, MedicalInstitutionSummaryURL } from '@/router/data'
import router from '@/router/index'
import { type ILotNumberItem, type IMedicalInstitutionSummary } from '@/types/MedicalInstitutionReports'
import { CreateBarChartOption, CreatePieChartOption } from '@/tools/ChartOptions'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = '#2962ff'

const medicalInstitutionSummary = shallowRef<IMedicalInstitutionSummary>()
onMounted(() => {
  axios
    .get<IMedicalInstitutionSummary>(MedicalInstitutionSummaryURL)
    .then((response) => {
      medicalInstitutionSummary.value = response.data

      const scr = medicalInstitutionSummary.value.medical_institution_summary_from_reports.sum_causal_relationship
      for (let index = 0; index < Object.keys(scr).length; index++) {
        causalRelationshipLabels.value.push(Object.keys(scr)[index])      
      }
      causalRelationshipSeries.value = Object.values(scr)

      const ss = medicalInstitutionSummary.value.medical_institution_summary_from_reports.sum_severities_of_related
      for (let index = 0; index < Object.keys(ss).length; index++) {
        severityLabels.value.push(Object.keys(ss)[index])      
      }
      severitySeries.value = Object.values(ss)

      const top_ten_list = medicalInstitutionSummary.value.medical_institution_summary_from_reports.lot_no_info.top_ten_list
      const lot_no_data = []
      for (let index = 0; index < top_ten_list.length; index++) {
        lot_no_data.push({x: top_ten_list[index].lot_no, y: top_ten_list[index].count})
      }
      lotNumberSeries.value = lot_no_data
      lotNumberTopTenList.value = top_ten_list
   
      // 2つ目以降のグラフが手動リフレッシュ無しにちゃんと表示されるようにするために必要な処理
      window.dispatchEvent(new Event('resize'))
    })
    .catch((error) => console.log('failed to get medical insutitution summary data: ' + error))
})

const isPersentView = shallowRef(true)

const causalRelationshipLabels = shallowRef<string[]>([])
const causalRelationshipSeries = shallowRef<any[]>([])
const causalRelationshipOptions = CreatePieChartOption('報告医の因果関係評価による内訳', causalRelationshipLabels, isPersentView)

const severityLabels = shallowRef<string[]>([])
const severitySeries = shallowRef<any[]>([])
const severityOptions = CreatePieChartOption('「関連あり」案件の重篤度による内訳', severityLabels, isPersentView)

const lotNumberSeries = shallowRef<any[]>([])
const lotNumberOptions = CreateBarChartOption('報告が多いロットNoの上位10種')
const lotNumberTopTenList = shallowRef<ILotNumberItem[]>([])

const changeChartView = () => {
  isPersentView.value = !isPersentView.value
  window.dispatchEvent(new Event('resize'))
}

const createUrl = (value: string) => {
  return '#/reports-from-medical-institution?ln=' + value
}
</script>

<style lang="scss"></style>

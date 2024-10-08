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
      <CustomHeader1 title="副反応疑い報告"></CustomHeader1>
      <p class="text-body-1 mb-5">
        予防接種法に基づいて医療機関から報告された副反応疑い報告 <span class="big-bold">{{ medicalInstitutionSummary?.medical_institution_summary_from_reports.total_count.toLocaleString() }}</span> [件] の集計結果を示します。
      </p>

      <CustomHeader2 title="報告医の評価"></CustomHeader2>
      <p class="text-body-1 mb-1">
        報告医による因果関係評価の内訳や、報告医が関連の有無を評価した結果の内訳です。
      </p>

      <div class="d-flex justify-end">
        <v-btn size="small" @click="changeChartView" color="blue" v-if="isPersentView">件数を表示</v-btn>
        <v-btn size="small" @click="changeChartView" color="blue" v-else>割合を表示</v-btn>
      </div>

      <v-row class="mb-5">
        <v-col cols="12" sm="6">
          <apexchart :options="causalRelationshipOptions" :series="causalRelationshipSeries"></apexchart>
        </v-col>

        <v-col cols="12" sm="6">
          <apexchart :options="severityOptions" :series="severitySeries"></apexchart>
        </v-col>
      </v-row>

      <p class="text-caption text-right">※ このページは <b>{{ medicalInstitutionSummary?.medical_institution_summary_from_reports.date }}</b> 時点までの報告内容に基づいた集計結果を表示しています。</p>
    </v-container>

  </v-container>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import axios from 'axios'
import { AppBarTitle, AppBarColor, MedicalInstitutionSummaryURL, AppBarUseHelpPage, AppBarHelpPageLink } from '@/router/data'
import router from '@/router/index'
import { type IMedicalInstitutionSummary } from '@/types/MedicalInstitutionReports'
import { CreatePieChartOption } from '@/tools/ChartOptions'
import CustomHeader1 from '@/components/CustomHeader1.vue'
import CustomHeader2 from '@/components/CustomHeader2.vue'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = '#2962ff'
AppBarUseHelpPage.value = true
AppBarHelpPageLink.value = 'how-to-use-summary-page'

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

const changeChartView = () => {
  isPersentView.value = !isPersentView.value
  window.dispatchEvent(new Event('resize'))
}
</script>

<style scoped lang="css">
.big-bold {
  font-size: 1.4rem;
  font-weight: bolder;
}
</style>

<template>
  <v-container fluid>

    <v-container v-if="medicalInstitutionSummary == undefined">
      <v-progress-circular color="primary" indeterminate :size="100" :width="10"></v-progress-circular>
    </v-container>

    <v-container v-else>
      <CustomHeader1 title="参考情報"></CustomHeader1>

      <v-card class="mx-auto mb-10" elevation="6">
        <template v-slot:title>
          <span class="font-weight-black">注意事項</span>
        </template>

        <v-card-text class="text-body-1">
          <v-row>
            <v-col cols="1">
              <CustomWarningIcon size="medium" />
            </v-col>
            <v-col cols="11" class="pl-7">
              <p class="text-body-1">
                このページの内容は、膨大な副反応疑い報告から考察・調査を行う糸口を掴んでいただく一助となることを意図しております。
              </p>
              <p class="mt-2">
                <span class="wave-under-bar">特定ロットNoと報告の多寡は複合的な要因が関連する情報であり、<span
                    class="big-bold">直接的な因果関係は実証されていません。</span>
                  あくまでも「 <span class="big-bold">参考情報</span> 」としてご活用ください。</span>
              </p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <CustomHeader2 title="ロットNoによる集計"></CustomHeader2>
      <p class="text-body-1 mb-7">
        ロットNoが不明・空白の報告は <span class="big-bold">{{
          medicalInstitutionSummary?.medical_institution_summary_from_reports.lot_no_info.invalid_count.toLocaleString()
          }}</span> [件] です。以下の集計は、それらを除いた結果に基づいた上位10種を示しています。
      </p>

      <v-row class="mb-2">
        <v-col cols="12" sm="6">
          <HorizontalBarGraph :graph-title="['報告が多いロットNoの上位10種']"
          x-axis-title="報告件数" download-file-name="lot-number-graph" :series="lotNumberSeries"></HorizontalBarGraph>
        </v-col>

        <v-col cols="12" sm="6" class="mt-2">
          <b>ロットNoのリンク一覧</b>
          <ol class="pl-10 mt-2">
            <li v-for="(lotno_data, i) in lotNumberTopTenList" :key="i" class="mb-2">
              <a :href="createUrl(lotno_data.lot_no)" target="_blank"><b>{{ lotno_data.lot_no }}</b></a> ({{
              lotno_data.manufacturer }})
            </li>
          </ol>
          <p class="text-caption text-left mt-4">※ リンク先の報告一覧では「同時接種したワクチン」を含む報告も表示されるため、件数が異なる場合があります。</p>
        </v-col>
      </v-row>

      <v-row class="mb-2">
        <v-col cols="12" sm="6">
          <HorizontalBarGraph :graph-title="['報告が多いロットNoの','上位10種（モデルナのみ）']" 
          x-axis-title="報告件数" download-file-name="moderna-lot-number-graph" :series="modernaLotNumberSeries"></HorizontalBarGraph>
        </v-col>

        <v-col cols="12" sm="6" class="mt-2">
          <b>ロットNoのリンク一覧（モデルナのみ）</b>
          <ol class="pl-10 mt-2">
            <li v-for="(lotno_data, i) in modernaLotNumberTopTenList" :key="i" class="mb-2">
              <a :href="createUrl(lotno_data.lot_no)" target="_blank"><b>{{ lotno_data.lot_no }}</b></a> ({{
              lotno_data.manufacturer }})
            </li>
          </ol>
          <p class="text-caption text-left mt-4">※ リンク先の報告一覧では「同時接種したワクチン」を含む報告も表示されるため、件数が異なる場合があります。</p>
        </v-col>
      </v-row>

      <p class="text-caption text-right">※ このページは <b>{{
          medicalInstitutionSummary?.medical_institution_summary_from_reports.date }}</b> 時点までの報告内容に基づいた集計結果を表示しています。
      </p>
    </v-container>

  </v-container>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import axios from 'axios'
import { AppBarTitle, AppBarColor, MedicalInstitutionSummaryURL, AppBarUseHelpPage, AppBarHelpPageLink } from '@/router/data'
import router from '@/router/index'
import { type IMedicalInstitutionSummary } from '@/types/MedicalInstitutionReports'
import type { ILotNumberItem } from '@/types/LotNumberInfomation'
import CustomHeader1 from '@/components/CustomHeader1.vue'
import CustomHeader2 from '@/components/CustomHeader2.vue'
import HorizontalBarGraph from '@/components/HorizontalBarGraph.vue'
import CustomWarningIcon from '@/components/CustomWarningIcon.vue'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = 'blue-accent-1'
AppBarUseHelpPage.value = true
AppBarHelpPageLink.value = 'how-to-use-summary-page'

const medicalInstitutionSummary = shallowRef<IMedicalInstitutionSummary>()
onMounted(() => {
  axios
    .get<IMedicalInstitutionSummary>(MedicalInstitutionSummaryURL)
    .then((response) => {
      medicalInstitutionSummary.value = response.data

      const top_ten_list = medicalInstitutionSummary.value.medical_institution_summary_from_reports.lot_no_info.top_ten_list
      const lot_no_data = []
      for (let index = 0; index < top_ten_list.length; index++) {
        lot_no_data.push({x: top_ten_list[index].lot_no, y: top_ten_list[index].count})
      }
      lotNumberSeries.value = lot_no_data
      lotNumberTopTenList.value = top_ten_list

      const moderna_top_ten_list = medicalInstitutionSummary.value.medical_institution_summary_from_reports.lot_no_info.top_ten_list_moderna
      const moderna_lot_no_data = []
      for (let index = 0; index < moderna_top_ten_list.length; index++) {
        moderna_lot_no_data.push({x: moderna_top_ten_list[index].lot_no, y: moderna_top_ten_list[index].count})
      }
      modernaLotNumberSeries.value = moderna_lot_no_data
      modernaLotNumberTopTenList.value = moderna_top_ten_list
   
      // 2つ目以降のグラフが手動リフレッシュ無しにちゃんと表示されるようにするために必要な処理
      window.dispatchEvent(new Event('resize'))
    })
    .catch((error) => console.log('failed to get medical insutitution summary data: ' + error))
})

const lotNumberSeries = shallowRef<any[]>([])
const lotNumberTopTenList = shallowRef<ILotNumberItem[]>([])

const modernaLotNumberSeries = shallowRef<any[]>([])
const modernaLotNumberTopTenList = shallowRef<ILotNumberItem[]>([])

const createUrl = (value: string) => {
  return '#/reports-from-medical-institution?ln=' + value
}
</script>

<style scoped lang="css">
.big-bold {
  font-size: 1.4rem;
  font-weight: bolder;
}

.wave-under-bar{
  text-decoration: underline;
  text-underline-offset: 4px;
  line-height: 1.5;
}
</style>

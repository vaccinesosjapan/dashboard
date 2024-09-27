<template>
  <v-container fluid>

    <v-container v-if="carditisSummary == undefined">
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
              <v-icon icon="mdi-alert-decagram-outline" size="70" color="warning"></v-icon>
            </v-col>
            <v-col cols="11">
              <p class="text-body-1">
                このページの内容は、膨大な心筋炎/心膜炎報告や亡くなった方々の報告（いずれも製造販売業者からの副反応疑い報告が母集団）から考察・調査を行う糸口を掴んでいただく一助となることを意図しております。
              </p>
              <p class="mt-2">
                <span class="wave-under-bar">特定ロットNoと報告の多寡は複合的な要因が関連する情報であり、<span class="big-bold">直接的な因果関係は実証されていません。</span>
                あくまでも「 <span class="big-bold">参考情報</span> 」としてご活用ください。</span>
              </p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <CustomHeader2 title="ロットNoによる集計（心筋炎/心膜炎）"></CustomHeader2>
      <p class="text-body-1 mb-7">
        ロットNoが不明・空白の報告は <span class="big-bold">{{
          carditisSummary?.carditis_summary_from_reports.lot_no_info.invalid_count.toLocaleString()
          }}</span> [件] です。以下の集計は、それらを除いた結果に基づいた上位10種を示しています。
      </p>

      <v-row class="mb-2">
        <v-col cols="12" sm="6">
          <HorizontalBarGraph :graph-title="['心筋炎/心膜炎の報告が多い','ロットNoの上位10種']"
          x-axis-title="報告件数" download-file-name="carditis-lot-number-graph" :series="carditisLotNumberSeries"></HorizontalBarGraph>
        </v-col>

        <v-col cols="12" sm="6" class="mt-2">
          <b>ロットNoのリンク一覧</b>
          <ol class="pl-10 mt-2">
            <li v-for="(lotno_data, i) in carditisLotNumberTopTenList" :key="i" class="mb-2">
              <a :href="createUrlForCarditis(lotno_data.lot_no)" target="_blank"><b>{{ lotno_data.lot_no }}</b></a> ({{
              lotno_data.manufacturer }})
            </li>
          </ol>
          <p class="text-caption text-left mt-4">※ リンク先の報告一覧では「同時接種したワクチン」を含む報告も表示されるため、件数が異なる場合があります。</p>
        </v-col>
      </v-row>

      <v-row class="mb-2">
        <v-col cols="12" sm="6">
          <HorizontalBarGraph :graph-title="['心筋炎/心膜炎の報告が多い','ロットNoの上位10種（モデルナのみ）']"
          x-axis-title="報告件数" download-file-name="carditis-moderna-lot-number-graph" :series="carditisModernaLotNumberSeries"></HorizontalBarGraph>
        </v-col>

        <v-col cols="12" sm="6" class="mt-2">
          <b>ロットNoのリンク一覧（モデルナのみ）</b>
          <ol class="pl-10 mt-2">
            <li v-for="(lotno_data, i) in carditisModernaLotNumberTopTenList" :key="i" class="mb-2">
              <a :href="createUrlForCarditis(lotno_data.lot_no)" target="_blank"><b>{{ lotno_data.lot_no }}</b></a> ({{
              lotno_data.manufacturer }})
            </li>
          </ol>
          <p class="text-caption text-left mt-4">※ リンク先の報告一覧では「同時接種したワクチン」を含む報告も表示されるため、件数が異なる場合があります。</p>
        </v-col>
      </v-row>

      <CustomHeader2 title="ロットNoによる集計（亡くなった方々）"></CustomHeader2>
      <p class="text-body-1 mb-7">
        ロットNoが不明・空白の報告は <span class="big-bold">{{
          deathSummary?.death_summary_from_reports.lot_no_info.invalid_count.toLocaleString()
          }}</span> [件] です。以下の集計は、それらを除いた結果に基づいた上位10種を示しています。
      </p>

      <v-row class="mb-2">
        <v-col cols="12" sm="6">
          <HorizontalBarGraph :graph-title="['亡くなった方の報告が多い','ロットNoの上位10種']"
          x-axis-title="報告件数" download-file-name="death-lot-number-graph" :series="deathLotNumberSeries"></HorizontalBarGraph>
        </v-col>

        <v-col cols="12" sm="6" class="mt-2">
          <b>ロットNoのリンク一覧</b>
          <ol class="pl-10 mt-2">
            <li v-for="(lotno_data, i) in deathLotNumberTopTenList" :key="i" class="mb-2">
              <a :href="createUrlForDeath(lotno_data.lot_no)" target="_blank"><b>{{ lotno_data.lot_no }}</b></a> ({{
              lotno_data.manufacturer }})
            </li>
          </ol>
          <p class="text-caption text-left mt-4">※ リンク先の報告一覧では「同時接種したワクチン」を含む報告も表示されるため、件数が異なる場合があります。</p>
        </v-col>
      </v-row>

      <v-row class="mb-2">
        <v-col cols="12" sm="6">
          <HorizontalBarGraph :graph-title="['亡くなった方の報告が多い','ロットNoの上位10種（モデルナのみ）']"
          x-axis-title="報告件数" download-file-name="death-moderna-lot-number-graph" :series="deathModernaLotNumberSeries"></HorizontalBarGraph>
        </v-col>

        <v-col cols="12" sm="6" class="mt-2">
          <b>ロットNoのリンク一覧（モデルナのみ）</b>
          <ol class="pl-10 mt-2">
            <li v-for="(lotno_data, i) in deathModernaLotNumberTopTenList" :key="i" class="mb-2">
              <a :href="createUrlForDeath(lotno_data.lot_no)" target="_blank"><b>{{ lotno_data.lot_no }}</b></a> ({{
              lotno_data.manufacturer }})
            </li>
          </ol>
          <p class="text-caption text-left mt-4">※ リンク先の報告一覧では「同時接種したワクチン」を含む報告も表示されるため、件数が異なる場合があります。</p>
        </v-col>
      </v-row>

      <p class="text-caption text-right">※ このページは <b>{{ deathSummary?.death_summary_from_reports.date }}</b> 時点までの報告内容に基づいた集計結果を表示しています。
      </p>
    </v-container>

  </v-container>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import axios from 'axios'
import { AppBarTitle, AppBarColor, CarditisSummaryFromReportsURL, DeathSummaryFromReportsURL, AppBarUseHelpPage, AppBarHelpPageLink } from '@/router/data'
import router from '@/router/index'
import type { ILotNumberItem } from '@/types/LotNumberInfomation'
import type { ICarditisSummaryFromReportsRoot } from '@/types/CarditisSummaryFromReports'
import type { IDeathSummaryFromReportsRoot } from '@/types/DeathSummaryFromReports'
import CustomHeader1 from '@/components/CustomHeader1.vue'
import CustomHeader2 from '@/components/CustomHeader2.vue'
import HorizontalBarGraph from '@/components/HorizontalBarGraph.vue'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = 'blue-accent-1'
AppBarUseHelpPage.value = true
AppBarHelpPageLink.value = 'how-to-use-summary-page'

const carditisSummary = shallowRef<ICarditisSummaryFromReportsRoot>()
const deathSummary = shallowRef<IDeathSummaryFromReportsRoot>()
onMounted(() => {
  axios
    .get<ICarditisSummaryFromReportsRoot>(CarditisSummaryFromReportsURL)
    .then((response) => {
      carditisSummary.value = response.data

      const top_ten_list = carditisSummary.value.carditis_summary_from_reports.lot_no_info.top_ten_list
      const lot_no_data = []
      for (let index = 0; index < top_ten_list.length; index++) {
        lot_no_data.push({x: top_ten_list[index].lot_no, y: top_ten_list[index].count})
      }
      carditisLotNumberSeries.value = lot_no_data
      carditisLotNumberTopTenList.value = top_ten_list

      const moderna_top_ten_list = carditisSummary.value.carditis_summary_from_reports.lot_no_info.top_ten_list_moderna
      const moderna_lot_no_data = []
      for (let index = 0; index < moderna_top_ten_list.length; index++) {
        moderna_lot_no_data.push({x: moderna_top_ten_list[index].lot_no, y: moderna_top_ten_list[index].count})
      }
      carditisModernaLotNumberSeries.value = moderna_lot_no_data
      carditisModernaLotNumberTopTenList.value = moderna_top_ten_list
   
      // 2つ目以降のグラフが手動リフレッシュ無しにちゃんと表示されるようにするために必要な処理
      window.dispatchEvent(new Event('resize'))
    })
    .catch((error) => console.log('failed to get carditis summary data: ' + error))

  axios
    .get<IDeathSummaryFromReportsRoot>(DeathSummaryFromReportsURL)
    .then((response) => {
      deathSummary.value = response.data

      const top_ten_list = deathSummary.value.death_summary_from_reports.lot_no_info.top_ten_list
      const lot_no_data = []
      for (let index = 0; index < top_ten_list.length; index++) {
        lot_no_data.push({x: top_ten_list[index].lot_no, y: top_ten_list[index].count})
      }
      deathLotNumberSeries.value = lot_no_data
      deathLotNumberTopTenList.value = top_ten_list

      const moderna_top_ten_list = deathSummary.value.death_summary_from_reports.lot_no_info.top_ten_list_moderna
      const moderna_lot_no_data = []
      for (let index = 0; index < moderna_top_ten_list.length; index++) {
        moderna_lot_no_data.push({x: moderna_top_ten_list[index].lot_no, y: moderna_top_ten_list[index].count})
      }
      deathModernaLotNumberSeries.value = moderna_lot_no_data
      deathModernaLotNumberTopTenList.value = moderna_top_ten_list
   
      // 2つ目以降のグラフが手動リフレッシュ無しにちゃんと表示されるようにするために必要な処理
      window.dispatchEvent(new Event('resize'))
    })
    .catch((error) => console.log('failed to get death summary data: ' + error))
})

const carditisLotNumberSeries = shallowRef<any[]>([])
const carditisLotNumberTopTenList = shallowRef<ILotNumberItem[]>([])

const carditisModernaLotNumberSeries = shallowRef<any[]>([])
const carditisModernaLotNumberTopTenList = shallowRef<ILotNumberItem[]>([])

const createUrlForCarditis = (value: string) => {
  return '#/reported-myocarditis-issues?ln=' + value
}

const deathLotNumberSeries = shallowRef<any[]>([])
const deathLotNumberTopTenList = shallowRef<ILotNumberItem[]>([])

const deathModernaLotNumberSeries = shallowRef<any[]>([])
const deathModernaLotNumberTopTenList = shallowRef<ILotNumberItem[]>([])

const createUrlForDeath = (value: string) => {
  return '#/reported-death-issues?ln=' + value
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
}
</style>

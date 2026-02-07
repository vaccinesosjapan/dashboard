<template>
  <v-sheet variant="elevated" color="blue-grey-darken-1">

    <h5 class="text-h5 pl-2 pt-2">{{ report.source.name }} の 症例 No.{{ report.no }}</h5>

    <v-row>
      <v-col cols="12" md="4">
        <v-card variant="flat" color="blue-grey-darken-1">
          <v-card-title class="card-title">症状と経過の詳細</v-card-title>
          <v-card-text>
            <v-timeline density="compact" align="start">
              <v-timeline-item dot-color="yellow-darken-1" size="x-small">
                <strong class="mb-4">{{ vaccinated_dates }}</strong>
                <ul class="pl-5 pt-1">
                  <li>ワクチンを接種</li>
                </ul>
              </v-timeline-item>

              <v-timeline-item dot-color="orange" size="x-small" v-for="([day, pts], i) in getMapWithDateAndPT(onset_dates, PT_names)" :key="day + '-' + i">
                <strong class="mb-4">{{ day }}</strong><span v-if="ElapsedDays(vaccinated_dates[0], day) != undefined">: [接種から <v-chip variant="elevated" label size="small" color="blue-grey-lighten-5">{{ ElapsedDays(vaccinated_dates[0], day) }}</v-chip> 日後]</span>
                <ul class="pl-5 pt-1" v-for="pt, j in pts" :key="j">
                  <li>{{ pt }}</li>
                </ul>
              </v-timeline-item>

              <v-timeline-item
                :dot-color="getTimeLineColor(gross_results[i])"
                size="x-small"
                v-for="([rDay, rs], i) in getMapWithResultDateAndResult(gross_result_dates, gross_results)"
                :key="rDay + '-' + i"
              >
                <strong class="mb-4">{{ rDay }}</strong><span v-if="ElapsedDays(vaccinated_dates[0], rDay) != undefined">: [接種から <v-chip variant="elevated" label size="small" color="blue-grey-lighten-5">{{ ElapsedDays(vaccinated_dates[0], rDay) }}</v-chip> 日後]</span>
                <ul class="pl-5 pt-1" v-for="r, j in rs" :key="j">
                  <li>{{ r }} ({{ PT_names[j] }})</li>
                </ul>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card variant="flat" color="blue-grey-darken-1">
          <v-card-title class="card-title">基礎疾患等</v-card-title>
          <v-card-text>
            <ul class="pl-4" v-for="dName, j in report.pre_existing_disease_names" :key="j">
              <li>{{ dName }}</li>
            </ul>
          </v-card-text>
        </v-card>

        <v-card v-if="report.concurrent_vaccination_flag" variant="flat" color="blue-grey-darken-1">
          <v-card-title class="card-title">同時接種したワクチン</v-card-title>
          <v-card-text>
            <ul class="pl-4">
              <li>ワクチン名&emsp; : {{ vaccine_name }}</li>
              <li>製造販売業者 : {{ manufacturer }}</li>
              <li>ロット番号&emsp; : {{ lot_no }}</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card variant="flat" color="blue-grey-darken-1">
          <v-card-title class="card-title">専門家による評価</v-card-title>
          <v-card-text>
            <ul class="pl-4">
              <li class="mb-2">評価PT: <span v-if="report.pt_by_expert == ''">なし</span>
                <div v-else>
                  <ul class="pl-4" v-for="ptName, j in report.pt_by_expert.split('、')" :key="j">
                    <li>{{ ptName }}</li>
                  </ul>
                </div>
              </li>
              <li class="mb-2">因果関係評価: {{ report.causal_relationship_by_expert == "" ? "なし" : report.causal_relationship_by_expert }}</li>
              <li class="mb-2">ブライトン分類レベル: {{ report.brighton_classification_by_expert == "" ? "なし": report.brighton_classification_by_expert }}</li>
              <li>意見: <span v-if="report.comments_by_expert == ''">なし</span>
                <div v-else>
                  <span class="pl-3">{{ report.comments_by_expert }}</span>
                </div>
              </li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col v-if="report.concurrent_vaccination_flag" cols="12" md="4">
      </v-col>
    </v-row>

    <v-btn class="ml-2 mb-2" variant="outlined" @click="clickClose">詳細表示を閉じる</v-btn>

  </v-sheet>
</template>

<script setup lang="ts">
import { ElapsedDays } from '@/tools/ElapsedDays';
import type { IMedicalInstitutionReport } from '@/types/MedicalInstitutionReports';

const props = defineProps<{
  report: IMedicalInstitutionReport
  no: number
  vaccinated_dates: string[]
  onset_dates: string[]
  PT_names: string[]
  gross_result_dates: string[]
  gross_results: string[]
  clickClose: () => void
}>()

const split_concurrent_vaccination = props.report.concurrent_vaccination.split(';')
const vaccine_name = split_concurrent_vaccination.length > 0 ? split_concurrent_vaccination[0] : ''
const manufacturer = split_concurrent_vaccination.length > 1 ? split_concurrent_vaccination[1] : ''
const lot_no = split_concurrent_vaccination.length > 2 ? split_concurrent_vaccination[2] : ''

const getMapWithDateAndPT = (dates: string[], PTs: string[]): Map<string, string[]> => {
  let ptMap = new Map<string, string[]>();
  let index = 0
  for (index; index < dates.length; index++) {
    var val = ""
    if(PTs.length <= index){
      val = ""
    } else {
      val = PTs[index]
    }

    if(val == "" || val == ' '){
      continue
    }

    if( !ptMap.has(dates[index]) ){
      ptMap.set(dates[index], [val])
    } else {
      ptMap.get(dates[index])?.push(val)
    }
  }

  if(PTs.length > dates.length){
    for (let pIndex = index; pIndex < PTs.length; pIndex++) {
      const ptVal = PTs[pIndex]
      if(ptVal != ""){
        ptMap.get(dates[index-1])?.push(ptVal)
      }
    }
  }

  return new Map([...ptMap.entries()].sort())
}

const getMapWithResultDateAndResult = (resultDates: string[], results: string[]): Map<string, string[]> => {
  let ptMap = new Map<string, string[]>();
  let index = 0
  for (index; index < resultDates.length; index++) {
    var val = ""
    if(results.length <= index){
      val = ""
    } else {
      val = results[index]
    }

    if(val == "" || val == ' '){
      continue
    }

    if( !ptMap.has(resultDates[index]) ){
      ptMap.set(resultDates[index], [val])
    } else {
      ptMap.get(resultDates[index])?.push(val)
    }
  }

  if(results.length > resultDates.length){
    for (let pIndex = index; pIndex < results.length; pIndex++) {
      const ptVal = results[pIndex]
      if(ptVal != ""){
        ptMap.get(resultDates[index-1])?.push(ptVal)
      }
    }
  }

  return new Map([...ptMap.entries()].sort())
}

const getTimeLineColor = (r: string): string => {
  if(r.indexOf('死亡') > -1) return 'red'
  if(r.indexOf('後遺症あり') > -1) return 'pink-darken-4'
  if(r.indexOf('未回復') > -1) return 'orange'
  if(r.indexOf('軽快') > -1) return 'lime'
  if(r.indexOf('回復') > -1) return 'green'

  return 'grey'
}
</script>

<style scoped>
.card-title {
  text-decoration: underline;
  text-underline-offset: 0.15em;
}
</style>

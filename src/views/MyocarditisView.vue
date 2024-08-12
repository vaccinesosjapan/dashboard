<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title color="#00b0ff">
        <v-icon class="search-icon">mdi-magnify</v-icon>
        <span class="search-title">検索...</span>
        <v-spacer></v-spacer>
        <v-chip v-if="searchConditionChanged" size="small" variant="elevated" color="orange-lighten-3">検索ワード入力中</v-chip>
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <h6 class="text-h6">ワクチンに関する条件の設定</h6>
        <v-row align="end">
          <v-col v-for="item, i in vaccineSearchItems" :key="i" cols="12" :md="item.md">
            <v-text-field
              :label="item.label"
              v-model="item.model.value"
              :type="item.type"
              @input="searchTrigerFunc"
              @click:clear="clearTriggerFunc"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>

        <br />
        <h6 class="text-h6">個人に関する条件の設定</h6>
        <v-row align="end">
          <v-col v-for="item, i in individualSearchItems" :key="i" cols="12" :md="item.md" class="group">

            <NumberFilter v-if="item.type == 'age'"
            v-model:min="ageFromFilterVal" v-model:max="ageToFilterVal"
            :title="item.label" :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
            ></NumberFilter>

            <SelectItems v-else-if="item.type == 'gender'"
            v-model:values="genderFilterValues" v-model:items="genderFilterItems"
            :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
            :label="item.label"
            ></SelectItems>

            <DateFilter v-else-if="item.type == 'vaccinated_date'"
              v-model:start="vaccinatedDateFromFilterVal" v-model:end="vaccinatedDateToFilterVal"
              :title="item.label" :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
            ></DateFilter>

            <NumberFilter v-else-if="item.type == 'days_to_onset'"
            v-model:min="daysToOnsetFromFilterVal" v-model:max="daysToOnsetToFilterVal"
            :title="item.label" :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
            ></NumberFilter>

            <NumberFilter v-else-if="item.type == 'vaccinated_times'"
            v-model:min="vaccinatedTimesFromFilterVal" v-model:max="vaccinatedTimesToFilterVal"
            :title="item.label" :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
            ></NumberFilter>

            <DateFilter v-else-if="item.type == 'gross_result_date'"
              v-model:start="grossResultDateFromFilterVal" v-model:end="grossResultDateToFilterVal"
              :title="item.label" :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
            ></DateFilter>

            <v-text-field v-else
              :label="item.label"
              v-model="item.model.value"
              :type="item.type"
              @input="searchTrigerFunc"
              @click:clear="clearTriggerFunc"
              clearable
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row align="end">
          <v-col cols="12" md="2" class="group">
            <SelectItems
            v-model:values="causalRelFilterValues" v-model:items="causalRelFilterItems"
            :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
            label="専門家の因果関係評価"
            ></SelectItems>
          </v-col>

          <v-col cols="12" md="2" class="group">
            <EvaluationResultHelpDialog></EvaluationResultHelpDialog>
          </v-col>
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel>
      <SearchRelatedToolBar btn-color="blue-darken-3" :copy-func="copyUrlWithQueryParams" :download-func="downloadFilteredDataAsCsv" :clear-func="clearFilter"></SearchRelatedToolBar>
    </v-expansion-panel>

  </v-expansion-panels>
  <br />

  <v-data-table
    loading-text="データを読み込み中です。"
    :loading="loading"
    :items="dataTableItems as any"
    :headers="headers as any"
    :search="SearchTrigger"
    :custom-filter="() => { return true }"
    density="compact"
    class="data-table-suspect-issues"
    show-expand
    expand-on-click
    item-value="no"
    v-model:expanded="expandedArray"
    :custom-key-filter="customKeyFilter"
    items-per-page-text="ページに表示する項目数"
  >
    <template v-slot:[`item.manufacturer`]="item">
      <span class="manufacturer-text">{{ item.value }}</span>
    </template>

    <template v-slot:[`item.vaccine_name`]="item">
      <span class="vaccine-name-text">{{ item.value }}</span>
    </template>

    <template v-slot:[`item.onset_dates`]="item">
      <DatesRow :dates="item.value"></DatesRow> 
    </template>

    <template v-slot:[`item.pre_existing_disease_names`]="item">
      <StringArrayRow :s-array="item.value"></StringArrayRow>
    </template>

    <template v-slot:[`item.PT_names`]="item">
      <StringArrayRow :s-array="item.value"></StringArrayRow>
    </template>

    <template v-slot:[`item.gross_result_dates`]="item">
      <DatesRow :dates="item.value"></DatesRow> 
    </template>

    <template v-slot:[`item.gross_results`]="item">
      <StringArrayRow :s-array="item.value"></StringArrayRow>
    </template>

    <template v-slot:[`item.source.url`]="item">
      <a :href="item.item['source']['url']">{{ item.item['source']['name'] }}</a>
    </template>

    <template v-slot:expanded-row="{ item }">
      <td :colspan="headers.length + 1">
        <v-row>
          <v-col cols="12" md="6">
            <DateAndPTnames
            :no="item.no"
            :vaccinated_date="item.vaccinated_date"
            :onset_dates="item.onset_dates"
            :PT_names="item.PT_names"
            :gross_result_dates="item.gross_result_dates"
            :gross_results="item.gross_results"
            :clickClose="() => { expandedArray = expandedArray.filter( n => n !== item.no )}"
            ></DateAndPTnames>
          </v-col>
          <v-col cols="12" md="6">
            <PreExistingDiseaseCard title="基礎疾患一覧" :pre_existing_disease_names="item.pre_existing_disease_names"></PreExistingDiseaseCard>
          </v-col>
        </v-row>
      </td>
    </template>

  </v-data-table>

  <p class="text-caption text-right">※ 「 <a :href="carditisSummaryData?.carditis_summary.source.url">{{ carditisSummaryData?.carditis_summary.source.name }}</a> 」で
      発表された資料の <b>{{ carditisSummaryData?.carditis_issues.date }}</b> 時点までの集計一覧を用いています。</p>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import axios from 'axios'
import type { IReportedMyocarditisIssue } from '@/types/ReportedMyocarditis'
import type { IQueryParam } from '@/types/QueryParam'
import { ClearFilterValues, CreateUrlWithQueryParams, IsConditionChanged, ParseQueryParams } from '@/types/QueryParam'
import { CreateCsvContentRaw, DownloadCsvFile } from '@/types/FilteredDataAsCsv'
import type { ICarditisMetadata } from '@/types/CarditisMetadata'
import type { ICarditisSummaryRoot } from '@/types/CarditisSummary'
import { AppBarTitle, AppBarColor, CarditisReportsURL, CarditisSummaryURL, CarditisMetadataURL } from '@/router/data'
import router from '@/router/index'
import { DateArrayFilterFunc, DateFilterFunc, NumberFilterFunc, StringArrayFilterFunc, StringFilterFunc } from '@/tools/FilterFunc'
import { SearchTrigger, SearchTriggerFunc } from '@/tools/SearchTriggerFunc'
import StringArrayRow from '@/components/StringArrayRow.vue'
import DatesRow from '@/components/DatesRow.vue'
import PreExistingDiseaseCard from '@/components/PreExistingDiseaseCard.vue'
import DateAndPTnames from '@/components/DateAndPTnames.vue'
import NumberFilter from '@/components/NumberFilter.vue'
import DateFilter from '@/components/DateFilter.vue'
import SelectItems from '@/components/SelectItems.vue'
import SearchRelatedToolBar from '@/components/SearchRelatedToolBar.vue'
import EvaluationResultHelpDialog from '@/components/EvaluationResultHelpDialog.vue'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = '#2962ff'

const loading = shallowRef(true)
const dataTableItems = shallowRef<IReportedMyocarditisIssue[]>()
const carditisSummaryData = shallowRef<ICarditisSummaryRoot>()
onMounted(() => {
  axios
    .get<IReportedMyocarditisIssue[]>(CarditisReportsURL)
    .then((response) => {
      dataTableItems.value = response.data
      loading.value = false
    })
    .catch((error) => console.log('failed to get myocarditis data: ' + error))

  axios
    .get<ICarditisMetadata>(CarditisMetadataURL)
    .then((response) => {
      genderFilterItems.value = response.data.gender_list
      // todo 本当は生成したメタデータから一覧を作りたい
      causalRelFilterItems.value = ['', 'α', 'β', 'γ']
    })
    .catch((error) => console.log('failed to get carditis metadata: ' + error))

  axios
    .get<ICarditisSummaryRoot>(CarditisSummaryURL)
    .then((response) => {
      carditisSummaryData.value = response.data
    })
    .catch((error) => console.log('failed to get carditis summary data: ' + error))
})

const headers = [
  { key: 'data-table-expand', width: 10 },
  { title: 'No', align: 'start', key: 'no'},
  { title: '年齢', align: 'start', key: 'age'},
  { title: '性別', align: 'start', key: 'gender'},
  { title: '接種日', align: 'start', key: 'vaccinated_date'},
  { title: '症状発生日', align: 'start', key: 'onset_dates'},
  { title: '発症までの日数', align: 'start', key: 'days_to_onset', width: 80},
  { title: 'ワクチン名', align: 'start', key: 'vaccine_name'},
  { title: '製造販売業者', align: 'start', key: 'manufacturer'},
  { title: 'ロット番号', align: 'start', key: 'lot_no'},
  { title: '接種回数', align: 'start', key: 'vaccinated_times'},
  { title: '基礎疾患', align: 'start', key: 'pre_existing_disease_names' },
  { title: '症状名', align: 'start', key: 'PT_names' },
  { title: '転帰日', align: 'start', key: 'gross_result_dates' },
  { title: '転帰内容', align: 'start', key: 'gross_results' },
  { title: '専門家の因果関係評価', align: 'start', key: 'evaluated_result', width: 100},
  { title: '元資料', align: 'start', key: 'source.url'}
]

let expandedArray = shallowRef([])

const manufacturerFilterVal = shallowRef('')
const manufacturerFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, manufacturerFilterVal)
}

const vaccineNameFilterVal = shallowRef('')
const vaccineNameFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, vaccineNameFilterVal)
}

const lotNoFilterVal = shallowRef('')
const lotNoFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, lotNoFilterVal)
}

const ageFromFilterVal = shallowRef('')
const ageToFilterVal = shallowRef('')
const ageFilterFunc = (value: string): boolean => {
  return NumberFilterFunc(value, ageFromFilterVal, ageToFilterVal)
}

const genderFilterValues = shallowRef<any[]>([])
const genderFilterItems = shallowRef<string[]>([])
const genderFilterFunc = (value: any): boolean => {
  if (genderFilterValues.value.length == 0) return true
  // valueが空で検索したい場合もあるので、空文字か否かのチェックは不要
  if (genderFilterValues.value.indexOf(value) > -1) return true
  return false
}

const vaccinatedDateFromFilterVal = shallowRef('')
const vaccinatedDateToFilterVal = shallowRef('')
const vaccinatedDateFilterFunc = (value: string): boolean => {
  return DateFilterFunc(value, vaccinatedDateFromFilterVal, vaccinatedDateToFilterVal)
}

const daysToOnsetFromFilterVal = shallowRef('')
const daysToOnsetToFilterVal = shallowRef('')
const daysToOnsetFilterFunc = (value: string): boolean => {
  return NumberFilterFunc(value, daysToOnsetFromFilterVal, daysToOnsetToFilterVal)
}

const vaccinatedTimesFromFilterVal = shallowRef('')
const vaccinatedTimesToFilterVal = shallowRef('')
const vaccinatedTimesFilterFunc = (value: string): boolean => {
  return NumberFilterFunc(value.replace('回目', ''), vaccinatedTimesFromFilterVal, vaccinatedTimesToFilterVal)
}

const preExistingDiseaseFilterVal = shallowRef('')
const preExistingDiseaseFilterFunc = (value: any): boolean => {
  return StringArrayFilterFunc(value, preExistingDiseaseFilterVal)
}

const causalRelFilterValues = shallowRef<string[]>([])
const causalRelFilterItems = shallowRef<string[]>([])
const causalRelFilterFunc = (value: string): boolean => {
  if (causalRelFilterValues.value.length == 0) return true
  // valueが空で検索したい場合もあるので、空文字か否かのチェックは不要
  if (causalRelFilterValues.value.indexOf(value) > -1) return true
  return false
}

const PTnamesFilterVal = shallowRef('')
const PTnamesFilterFunc = (value: any): boolean => {
  return StringArrayFilterFunc(value, PTnamesFilterVal)
}

const grossResultDateFromFilterVal = shallowRef('')
const grossResultDateToFilterVal = shallowRef('')
const grossResultDateFilterFunc = (value: any): boolean => {
  return DateArrayFilterFunc(value, grossResultDateFromFilterVal, grossResultDateToFilterVal)
}

const grossResultFilterVal = shallowRef('')
const grossResultFilterFunc = (value: any): boolean => {
  return StringArrayFilterFunc(value, grossResultFilterVal)
}

const customKeyFilter = {
  manufacturer: manufacturerFilterFunc,
  vaccine_name: vaccineNameFilterFunc,
  lot_no: lotNoFilterFunc,
  age: ageFilterFunc,
  gender: genderFilterFunc,
  vaccinated_date: vaccinatedDateFilterFunc,
  days_to_onset: daysToOnsetFilterFunc,
  vaccinated_times: vaccinatedTimesFilterFunc,
  pre_existing_disease_names: preExistingDiseaseFilterFunc,
  PT_names: PTnamesFilterFunc,
  gross_result_dates: grossResultDateFilterFunc,
  gross_results: grossResultFilterFunc,
  evaluated_result: causalRelFilterFunc
}

const searchConditionChanged = shallowRef<boolean>(false)
const searchTrigerFunc = () => {
  SearchTriggerFunc()
  searchConditionChanged.value = IsConditionChanged(queryParamMap)
}
const clearTriggerFunc = () => {
  searchConditionChanged.value = IsConditionChanged(queryParamMap)
}

const pageQueryParams = router.currentRoute.value.query
const queryParamMap: IQueryParam[] = [
  {name: "mk", val: manufacturerFilterVal},
  {name: "vn", val: vaccineNameFilterVal},
  {name: "ln", val: lotNoFilterVal},
  {name: "adf", val: ageFromFilterVal},
  {name: "adt", val: ageToFilterVal},
  {name: "gen", val: genderFilterValues},
  {name: "vdf", val: vaccinatedDateFromFilterVal},
  {name: "vdt", val: vaccinatedDateToFilterVal},
  {name: "dtof", val: daysToOnsetFromFilterVal},
  {name: "dtot", val: daysToOnsetToFilterVal},
  {name: "vtf", val: vaccinatedTimesFromFilterVal},
  {name: "vtt", val: vaccinatedTimesToFilterVal},
  {name: "pre", val: preExistingDiseaseFilterVal},
  {name: "ptn", val: PTnamesFilterVal},
  {name: "grdf", val: grossResultDateFromFilterVal},
  {name: "grdt", val: grossResultDateToFilterVal},
  {name: "gr", val: grossResultFilterVal},
  {name: "cr", val: causalRelFilterValues},
]
searchConditionChanged.value = ParseQueryParams(queryParamMap, pageQueryParams)

const copyUrlWithQueryParams = () => {
  const retUrl = CreateUrlWithQueryParams(queryParamMap)
  if(navigator.clipboard){
    navigator.clipboard.writeText(retUrl);
  }
}

const _blank = shallowRef('')
const vaccineSearchItems = [
  { md: 4, label: "製造販売業者", model: manufacturerFilterVal, type: "text"},
  { md: 4, label: "ワクチン名", model: vaccineNameFilterVal, type: "text"},
  { md: 4, label: "ロット番号", model: lotNoFilterVal, type: "text"}
]
const individualSearchItems = [
  { md: 4, label: "年齢", model: _blank, type: "age"},
  { md: 4, label: "性別", model: _blank, type: "gender"},
  { md: 4, label: "接種日", model: _blank, type: "vaccinated_date"},
  { md: 4, label: "発症までの日数", model: _blank, type: "days_to_onset"},
  { md: 4, label: "接種回数", model: _blank, type: "vaccinated_times"},
  { md: 4, label: "基礎疾患", model: preExistingDiseaseFilterVal, type: "text"},
  { md: 4, label: "症状", model: PTnamesFilterVal, type: "text"},
  { md: 4, label: "転帰日", model: _blank, type: "gross_result_date"},
  { md: 4, label: "転帰内容", model: grossResultFilterVal, type: "text"},
]

const downloadFilteredDataAsCsv = () => {
  if(dataTableItems.value === undefined) return

  const filteredData : IReportedMyocarditisIssue[] = []
  for (let index = 0; index < dataTableItems.value.length; index++) {
    const rowItem = dataTableItems.value[index]
    let showThisRow = true

    // customKeyFilterによるフィルタ処理と同等の処理を行う
    if(!manufacturerFilterFunc(rowItem.manufacturer)) showThisRow=false
    if(!vaccineNameFilterFunc(rowItem.vaccine_name)) showThisRow=false
    if(!lotNoFilterFunc(rowItem.lot_no)) showThisRow=false
    if(!ageFilterFunc(rowItem.age)) showThisRow=false
    if(!genderFilterFunc(rowItem.gender)) showThisRow=false
    if(!vaccinatedDateFilterFunc(rowItem.vaccinated_date)) showThisRow=false
    if(!daysToOnsetFilterFunc(rowItem.days_to_onset)) showThisRow=false
    if(!vaccinatedTimesFilterFunc(rowItem.vaccinated_times)) showThisRow=false
    if(!preExistingDiseaseFilterFunc(rowItem.pre_existing_disease_names)) showThisRow=false
    if(!PTnamesFilterFunc(rowItem.PT_names)) showThisRow=false
    if(!grossResultDateFilterFunc(rowItem.gross_result_dates)) showThisRow=false
    if(!grossResultFilterFunc(rowItem.gross_results)) showThisRow=false
    if(!causalRelFilterFunc(rowItem.evaluated_result)) showThisRow=false

    if(showThisRow) filteredData.push(rowItem)
  }

  const headerTitles = headers.filter(head => head.title != undefined).map( head => head.title).join(',')
  const headerKeys = headers.filter(head => head.title != undefined).map( head => head.key)
  const csvContent = CreateCsvContentRaw<IReportedMyocarditisIssue>(filteredData, headerTitles, headerKeys)

  DownloadCsvFile(router.currentRoute.value.path.replace('/',''), csvContent)
}

const clearFilter = () => {
  ClearFilterValues(queryParamMap, searchConditionChanged)
}
</script>

<style scoped>
.group {
  padding-top: 0.4rem;
  padding-bottom: 0.3rem;
}
.manufacturer-text {
  font-size: 0.9rem;
}
.vaccine-name-text {
  font-size: 0.74rem;
}

.search-icon {
  font-size: 2rem;
}
.search-title {
  font-size: 1.5rem;
  padding-left: 0.8rem;
}
</style>

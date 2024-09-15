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
        <h6 class="text-h6 mb-2 underline">ワクチンに関する条件の設定</h6>
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
        <h6 class="text-h6 mb-2 underline">個人に関する条件の設定</h6>
        <v-row align="end">
          <v-col v-for="item, i in individualSearchItems" :key="i" cols="12" :md="item.md" class="group mb-1">
            <NumberFilter v-if="item.type == 'age'"
            v-model:min="ageFromFilterVal" v-model:max="ageToFilterVal"
            :title="item.label" :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
            ></NumberFilter>

            <SelectItems v-else-if="item.type == 'gender'"
            v-model:values="genderFilterValues" v-model:items="genderFilterItems"
            :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
            :label="item.label"
            ></SelectItems>

            <FlatpickrCalendar v-else-if="item.type == 'vaccinated_date'"
             :title="item.label" v-model:start="vaccinatedDateFromFilterVal" v-model:end="vaccinatedDateToFilterVal"></FlatpickrCalendar>

            <FlatpickrCalendar v-else-if="item.type == 'occurred_date'"
             :title="item.label" v-model:start="occurredDateFromFilterVal" v-model:end="occurredDateToFilterVal"></FlatpickrCalendar>

            <NumberFilter v-else-if="item.type == 'vaccinated_times'"
            v-model:min="vaccinatedTimesFromFilterVal" v-model:max="vaccinatedTimesToFilterVal"
            :title="item.label" :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
            ></NumberFilter>
            
            <SelectItems v-else-if="item.type == 'causal_rel'"
            v-model:values="causalRelFilterValues" v-model:items="causalRelFilterItems"
            :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
            :label="item.label"
            ></SelectItems>

            <SelectItems v-else-if="item.type == 'causal_rel_expert'"
            v-model:values="causalRelExpertFilterValues" v-model:items="causalRelExpertFilterItems"
            :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
            :label="item.label"
            ></SelectItems>

            <EvaluationResultHelpDialog v-else-if="item.type == 'causal_rel_expert_help'"></EvaluationResultHelpDialog>

            <v-text-field
              v-else
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
    color="#00b0ff"
    :items="dataTableItems as any"
    :headers="headers as any"
    :search="SearchTrigger"
    :custom-filter="
      () => {
        return true
      }
    "
    density="compact"
    class="data-table-suspect-issues"
    show-expand
    expand-on-click
    item-value="id"
    v-model:expanded="expandedArray"
    :custom-key-filter="customKeyFilter"
    items-per-page-text="ページに表示する項目数"
  >
    <template v-slot:[`item.manufacturer`]="item">
      <div class="maker-text">{{ item.value }}</div>
    </template>

    <template v-slot:[`item.vaccine_name`]="item">
      <div class="vaccine-name-text">{{ item.value }}</div>
    </template>

    <template v-slot:[`item.onset_dates`]="item">
      <DatesRow :dates="item.value"></DatesRow> 
    </template>

    <template v-slot:[`item.causal_relationship_by_expert`]="item">
      <CausualRelationshipRow :CR="item.value"></CausualRelationshipRow>
    </template>

    <template v-slot:[`item.PT_names`]="item">
      <StringArrayRow :s-array="item.value"></StringArrayRow>
    </template>

    <template v-slot:[`item.pre_existing_conditions`]="item">
      <StringRow :content="item.value"></StringRow>
    </template>

    <template v-slot:[`item.tests_used_for_determination`]="item">
      <StringRow :content="item.value"></StringRow>
    </template>

    <template v-slot:[`item.causal_relationship`]="item">
      <StringRow :content="item.value"></StringRow>
    </template>

    <template v-slot:[`item.comments_by_expert`]="item">
      <StringRow :content="item.value"></StringRow>
    </template>

    <template v-slot:expanded-row="{ item }">
      <td :colspan="headers.length + 1">
        <v-row cols="12" md="6">
          <v-col>
            <DeathDetail
            :no="item.no"
            :vaccinated_dates="item.vaccinated_dates"
            :onset_dates="item.onset_dates"
            :PT_names="item.PT_names"
            :clickClose="() => { expandedArray = expandedArray.filter( n => n !== item.id )}"
            ></DeathDetail>
          </v-col>

          <v-col cols="12" md="6">
            <PreExistingDiseaseCard title="基礎疾患等" :pre_existing_disease_names="item.pre_existing_conditions.split('\n')"></PreExistingDiseaseCard>
          </v-col>

          <v-col cols="12">
            <v-card variant="elevated" color="blue-grey-darken-1">
              <v-card-title>報告医が死因等の判断に至った検査</v-card-title>
              <v-card-text>{{ item.tests_used_for_determination }}</v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card variant="elevated" color="blue-grey-darken-1">
              <v-card-title>専門家のコメント</v-card-title>
              <v-card-text>{{ item.comments_by_expert }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </td>
    </template>

  </v-data-table>

  <p class="text-caption text-right">※ <b>{{ deathSummaryDataFromReports?.death_summary_from_reports.date }}</b> 時点までの集計一覧を用いています。</p>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import axios from 'axios'
import type { IReportedDeathIssue } from '@/types/ReportedDeath'
import type { IQueryParam } from '@/types/QueryParam'
import { ClearFilterValues, CreateUrlWithQueryParams, IsConditionChanged, ParseQueryParams } from '@/types/QueryParam'
import { CreateCsvContentRaw, DownloadCsvFile } from '@/types/FilteredDataAsCsv'
import type { IDeathSummaryFromReportsRoot } from '@/types/DeathSummaryFromReports'
import type { IDeathMetadata } from '@/types/DeathMetadata'
import { AppBarTitle, AppBarColor, DeathReportsURL, DeathSummaryFromReportsURL, DeathMetadataURL, AppBarUseHelpPage, AppBarHelpPageLink } from '@/router/data'
import router from '@/router/index'
import { SearchTrigger, SearchTriggerFunc } from '@/tools/SearchTriggerFunc'
import { NumberFilterFunc, DateFilterFunc, StringFilterFunc, DateArrayFilterFunc, StringArrayFilterFunc } from '@/tools/FilterFunc'
import StringRow from '@/components/StringRow.vue'
import StringArrayRow from '@/components/StringArrayRow.vue'
import DatesRow from '@/components/DatesRow.vue'
import DeathDetail from '@/components/DeathDetail.vue'
import PreExistingDiseaseCard from '@/components/PreExistingDiseaseCard.vue'
import CausualRelationshipRow from '@/components/CausualRelationshipRow.vue'
import SearchRelatedToolBar from '@/components/SearchRelatedToolBar.vue'
import SelectItems from '@/components/SelectItems.vue'
import EvaluationResultHelpDialog from '@/components/EvaluationResultHelpDialog.vue'
import NumberFilter from '@/components/NumberFilter.vue'
import FlatpickrCalendar from '@/components/FlatpickrCalendar.vue'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = '#2962ff'
AppBarUseHelpPage.value = true
AppBarHelpPageLink.value = 'how-to-search'

const loading = shallowRef(true)
const dataTableItems = shallowRef<IReportedDeathIssue[]>()
const deathSummaryDataFromReports = shallowRef<IDeathSummaryFromReportsRoot>()
onMounted(() => {
  axios
    .get<IReportedDeathIssue[]>(DeathReportsURL)
    .then((response) => {
      dataTableItems.value = response.data
      loading.value = false
    })
    .catch((error) => console.log('failed to get death data: ' + error))

  axios
    .get<IDeathMetadata>(DeathMetadataURL)
    .then((response) => {
      genderFilterItems.value = response.data.gender_list
      causalRelExpertFilterItems.value = response.data.causal_relationship_by_expert_list
    })
    .catch((error) => console.log('failed to get death metadata: ' + error))

  axios
    .get<IDeathSummaryFromReportsRoot>(DeathSummaryFromReportsURL)
    .then((response) => {
      deathSummaryDataFromReports.value = response.data

      // 2つ目以降のグラフが手動リフレッシュ無しにちゃんと表示されるようにするために必要な処理
      window.dispatchEvent(new Event('resize'))
    })
    .catch((error) => console.log('failed to get carditis summary data: ' + error))
})

let headers = [
  { key: 'data-table-expand', width: 20 },
  { title: 'No', align: 'start', key: 'no' },
  { title: '製造販売業者', align: 'start', key: 'manufacturer'},
  { title: 'ワクチン名', align: 'start', key: 'vaccine_name' },
  { title: '年齢', align: 'start', key: 'age' },
  { title: '性別', align: 'start', key: 'gender' },
  { title: '接種日', align: 'start', key: 'vaccinated_dates' },
  { title: '死亡日', align: 'start', key: 'onset_dates' },
  { title: 'ロット番号', align: 'start', key: 'lot_no' },
  { title: '接種回数', align: 'start', key: 'vaccinated_times' },
  { title: '基礎疾患等', align: 'start', key: 'pre_existing_conditions' },
  { title: '死因(MedDRA PT)', align: 'start', key: 'PT_names' },
  { title: '報告医が死因等の判断に至った検査', align: 'start', key: 'tests_used_for_determination' },
  { title: '報告医の因果関係評価', align: 'start', key: 'causal_relationship' },
  { title: '専門家の因果関係評価', align: 'start', key: 'causal_relationship_by_expert', width: 100 },
  { title: '専門家のコメント', align: 'end', key: 'comments_by_expert' },
]

let expandedArray = shallowRef([])

const makerFilterVal = shallowRef('')
const makerFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, makerFilterVal)
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
const genderFilterFunc = (value: string): boolean => {
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

const ptFilterVal = shallowRef('')
const ptFilterFunc = (value: any): boolean => {
  return StringArrayFilterFunc(value, ptFilterVal)
}

const testsForDeterminationVal = shallowRef('')
const testsForDeterminationFunc = (value: any): boolean => {
  return StringFilterFunc(value, testsForDeterminationVal)
}

const causalRelFilterValues = shallowRef<any[]>([])
// todo: 本来はdatasetsのmetadataから値を取りたい
const causalRelFilterItems = ['', '不明', '評価不能', '関連なし', '関連あり']
const causalRelFilterFunc = (value: string): boolean => {
  if (causalRelFilterValues.value.length == 0) return true
  // valueが空で検索したい場合もあるので、空文字か否かのチェックは不要
  if (causalRelFilterValues.value.indexOf(value) > -1) return true
  return false
}

const causalRelExpertFilterValues = shallowRef<any[]>([])
const causalRelExpertFilterItems = shallowRef<string[]>([])
const causalRelExpertFilterFunc = (value: string): boolean => {
  if (causalRelExpertFilterValues.value.length == 0) return true
  // valueが空で検索したい場合もあるので、空文字か否かのチェックは不要
  if (causalRelExpertFilterValues.value.indexOf(value) > -1) return true
  return false
}

const occurredDateFromFilterVal = shallowRef('')
const occurredDateToFilterVal = shallowRef('')
const occurredDateFilterFunc = (value: any): boolean => {
  return DateArrayFilterFunc(value, occurredDateFromFilterVal, occurredDateToFilterVal)
}

const vaccinatedTimesFromFilterVal = shallowRef('')
const vaccinatedTimesToFilterVal = shallowRef('')
const vaccinatedTimesFilterFunc = (value: string): boolean => {
  return NumberFilterFunc(value.replace('回目', ''), vaccinatedTimesFromFilterVal, vaccinatedTimesToFilterVal)
}

const preExistingConditionFilterVal = shallowRef('')
const preExistingConditionFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, preExistingConditionFilterVal)
}

const customKeyFilter = {
  manufacturer: makerFilterFunc,
  vaccine_name: vaccineNameFilterFunc,
  age: ageFilterFunc,
  gender: genderFilterFunc,
  vaccinated_dates: vaccinatedDateFilterFunc,
  onset_dates: occurredDateFilterFunc,
  lot_no: lotNoFilterFunc,
  vaccinated_times: vaccinatedTimesFilterFunc,
  pre_existing_conditions: preExistingConditionFilterFunc,
  PT_names: ptFilterFunc,
  tests_used_for_determination: testsForDeterminationFunc,
  causal_relationship: causalRelFilterFunc,
  causal_relationship_by_expert: causalRelExpertFilterFunc,
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
  {name: "mk", val: makerFilterVal},
  {name: "vn", val: vaccineNameFilterVal},
  {name: "adf", val: ageFromFilterVal},
  {name: "adt", val: ageToFilterVal},
  {name: "gen", val: genderFilterValues},
  {name: "vdf", val: vaccinatedDateFromFilterVal},
  {name: "vdt", val: vaccinatedDateToFilterVal},
  {name: "odf", val: occurredDateFromFilterVal},
  {name: "odt", val: occurredDateToFilterVal},
  {name: "ln", val: lotNoFilterVal},
  {name: "vtf", val: vaccinatedTimesFromFilterVal},
  {name: "vtt", val: vaccinatedTimesToFilterVal},
  {name: "pre", val: preExistingConditionFilterVal},
  {name: "pt", val: ptFilterVal},
  {name: "td", val: testsForDeterminationVal},
  {name: "crf", val: causalRelFilterValues},
  // パラメータ名をcreに変更したいところだが、互換性のためcrのままにする
  {name: "cr", val: causalRelExpertFilterValues},
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
  { md: 4, label: "製造販売業者", model: makerFilterVal, type: "text"},
  { md: 4, label: "ワクチン名", model: vaccineNameFilterVal, type: "text"},
  { md: 4, label: "ロット番号", model: lotNoFilterVal, type: "text"}
]
const individualSearchItems = [
  { md: 4, label: "年齢", model: _blank, type: "age"},
  { md: 4, label: "性別", model: _blank, type: "gender"},
  { md: 4, label: "接種日", model: _blank, type: "vaccinated_date"},
  { md: 4, label: "死亡日", model: _blank, type: "occurred_date"},
  { md: 4, label: "接種回数", model: _blank, type: "vaccinated_times"},
  { md: 4, label: "基礎疾患等", model: preExistingConditionFilterVal, type: "text"},
  { md: 4, label: "死因(MedDRA PT)", model: ptFilterVal, type: "text"},
  { md: 4, label: "報告医が死因等の判断に至った検査", model: testsForDeterminationVal, type: "text"},
  { md: 4, label: "報告医の因果関係評価", model: _blank, type: "causal_rel"},
  { md: 4, label: "専門家の因果関係評価", model: _blank, type: "causal_rel_expert"},
  { md: 4, label: "専門家の因果関係評価のヘルプ", model: _blank, type: "causal_rel_expert_help"},
]

const downloadFilteredDataAsCsv = () => {
  if(dataTableItems.value === undefined) return

  const filteredData : IReportedDeathIssue[] = []
  for (let index = 0; index < dataTableItems.value.length; index++) {
    const rowItem = dataTableItems.value[index]
    let showThisRow = true

    // customKeyFilterによるフィルタ処理と同等の処理を行う
    if(!makerFilterFunc(rowItem.manufacturer)) showThisRow=false
    if(!vaccineNameFilterFunc(rowItem.vaccine_name)) showThisRow=false
    if(!ageFilterFunc(rowItem.age.toString())) showThisRow=false
    if(!genderFilterFunc(rowItem.gender)) showThisRow=false
    if(!vaccinatedDateFilterFunc(rowItem.vaccinated_dates)) showThisRow=false
    if(!occurredDateFilterFunc(rowItem.onset_dates)) showThisRow=false
    if(!lotNoFilterFunc(rowItem.lot_no)) showThisRow=false
    if(!vaccinatedTimesFilterFunc(rowItem.vaccinated_times)) showThisRow=false
    if(!preExistingConditionFilterFunc(rowItem.pre_existing_conditions)) showThisRow=false
    if(!ptFilterFunc(rowItem.PT_names)) showThisRow=false
    if(!testsForDeterminationFunc(rowItem.tests_used_for_determination)) showThisRow=false
    if(!causalRelFilterFunc(rowItem.causal_relationship)) showThisRow=false
    if(!causalRelExpertFilterFunc(rowItem.causal_relationship_by_expert)) showThisRow=false

    if(showThisRow) filteredData.push(rowItem)
  }

  const headerTitles = headers.filter(head => head.title != undefined).map( head => head.title).join(',')
  const headerKeys = headers.filter(head => head.title != undefined).map( head => head.key)
  const csvContent = CreateCsvContentRaw<IReportedDeathIssue>(filteredData, headerTitles, headerKeys)

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
.maker-text {
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

.td-list {
  padding-left: 20px;
  padding-top: 5px;
}

.underline{
  text-underline-offset: 0.2rem;
  text-decoration-line: underline;
  text-decoration-color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  text-decoration-thickness: 1.2px;
}
</style>

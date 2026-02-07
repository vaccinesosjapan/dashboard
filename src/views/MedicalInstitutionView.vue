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
            <SearchableSelectItems v-if="item.type == 'manufacturer'"
              v-model:values="manufacturerFilterValues" v-model:items="manufacturerFilterItems"
              :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
              label="製造販売業者"
            >
              <template v-slot:help>
                <ConcurrentVaccinationHelp />
              </template>
            </SearchableSelectItems>

            <SearchableSelectItems v-else-if="item.type == 'vaccine_name'"
              v-model:values="vaccineNameFilterValues" v-model:items="vaccineNameFilterItems"
              :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
              label="ワクチン名"
            ></SearchableSelectItems>

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

        <br />
        <h6 class="text-h6 mb-2 underline">個人に関する条件の設定</h6>
        <v-row align="end">
          <v-col v-for="item, i in individualSearchItems" :key="i" cols="12" :md="item.md" class="group mb-1">
            <NumberFilter v-if="item.type == 'age-range'"
            v-model:min="ageFromFilterVal" v-model:max="ageToFilterVal"
            :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
            :title="item.label"
            ></NumberFilter>

            <SelectItems v-else-if="item.type == 'gender'"
            v-model:values="genderFilterValues" v-model:items="genderFilterItems"
            :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
            :label="item.label"
            ></SelectItems>

            <FlatpickrCalendar v-else-if="item.type == 'vaccinated_date'"
             :title="item.label" v-model:start="vaccinatedDateFromFilterVal" v-model:end="vaccinatedDateToFilterVal"></FlatpickrCalendar>

            <NumberFilter v-else-if="item.type == 'days_to_onset'"
            v-model:min="daysToOnsetFromFilterVal" v-model:max="daysToOnsetToFilterVal"
            :title="item.label" :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
            ></NumberFilter>

            <SelectItems v-else-if="item.type == 'causal_relationship'"
            v-model:values="causualFilterValues" v-model:items="causualFilterItems"
            :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
            :label="item.label"
            ></SelectItems>

            <SelectItems v-else-if="item.type == 'severity'"
            v-model:values="severityFilterValues" v-model:items="severityFilterItems"
            :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
            :label="item.label"
            ></SelectItems>

            <FlatpickrCalendar v-else-if="item.type == 'result_date'"
             :title="item.label" v-model:start="resultDateFromFilterVal" v-model:end="resultDateToFilterVal"></FlatpickrCalendar>

            <SelectItems v-else-if="item.type == 'result'"
            v-model:values="resultFilterValues" v-model:items="resultFilterItems"
            :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
            :label="item.label"
            ></SelectItems>

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
      </v-expansion-panel-text>
    </v-expansion-panel>

    <v-expansion-panel>
      <SearchRelatedToolBar btn-color="blue-darken-3" :copy-func="copyUrlWithQueryParams" :download-func="downloadFilterdDataAsCsv" :clear-func="clearFilter"></SearchRelatedToolBar>
    </v-expansion-panel>

  </v-expansion-panels>
  <br />

  <v-data-table
    loading-text="データを読み込み中です。"
    :loading="loading"
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
      <span class="manufacturer-text">{{ item.value }}</span>
    </template>

    <template v-slot:[`item.vaccine_name`]="item">
      <span class="vaccine-name-text">{{ item.value }}</span>
    </template>

    <template v-slot:[`item.concurrent_vaccination_flag`]="item">
      <ConcurrentVaccinationRow :flag="item.value" />
    </template>

    <template v-slot:[`item.vaccinated_dates`]="item">
      <DatesRow :dates="item.value"></DatesRow> 
    </template>

    <template v-slot:[`item.onset_dates`]="item">
      <DatesRow :dates="item.value"></DatesRow> 
    </template>

    <template v-slot:[`item.days_to_onset`]="item">
      <StringArrayRow :s-array="item.value"></StringArrayRow>
    </template>

    <template v-slot:[`item.causal_relationship`]="item">
      <CausualRelationshipRow :CR="item.value"></CausualRelationshipRow>
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
      <MedicalSourceCell :url="item.item['source']['url']" :id="item.item['id']" />
    </template>

    <template v-slot:expanded-row="{ item }">
      <td :colspan="headers.length + 1">
        <MedicalInstitutionDetail
          :report="item"
          :no="item.no"
          :vaccinated_dates="item.vaccinated_dates"
          :onset_dates="item.onset_dates"
          :PT_names="item.PT_names"
          :gross_result_dates="item.gross_result_dates"
          :gross_results="item.gross_results"
          :clickClose="() => { expandedArray = expandedArray.filter( n => n !== item.id )}"
        ></MedicalInstitutionDetail>
      </td>
    </template>

  </v-data-table>

  <p class="text-caption text-right">※ <b>{{ medicalInstitutionSummary?.medical_institution_summary_from_reports.date }}</b> 時点までの集計一覧を用いています。</p>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import axios from 'axios'
import router from '@/router/index'
import { AppBarTitle, AppBarColor, MedicalInstitutionReportsURL, MedicalInstitutionSummaryURL, MedicalInstitutionMetadataURL, AppBarUseHelpPage, AppBarHelpPageLink } from '@/router/data'
import { DateArrayFilterFunc, NumberFilterFunc, StringArrayFilterFunc, StringFilterFunc } from '@/tools/FilterFunc'
import { SearchTrigger, SearchTriggerFunc } from '@/tools/SearchTriggerFunc'
import type { IQueryParam } from '@/types/QueryParam'
import { ClearFilterValues, CreateUrlWithQueryParams, IsConditionChanged, ParseQueryParams } from '@/types/QueryParam'
import { CreateCsvContentRaw, DownloadCsvFile } from '@/types/FilteredDataAsCsv'
import type { IMedicalInstitutionReport, IMedicalInstitutionSummary } from '@/types/MedicalInstitutionReports'
import type { IMedicalInstitutionMetadata } from '@/types/MedicalInstitutionMetadata'
import StringArrayRow from '@/components/StringArrayRow.vue'
import DatesRow from '@/components/DatesRow.vue'
import CausualRelationshipRow from '@/components/CausualRelationshipRow.vue'
import SearchRelatedToolBar from '@/components/SearchRelatedToolBar.vue'
import SearchableSelectItems from '@/components/SearchableSelectItems.vue'
import SelectItems from '@/components/SelectItems.vue'
import NumberFilter from '@/components/NumberFilter.vue'
import FlatpickrCalendar from '@/components/FlatpickrCalendar.vue'
import ConcurrentVaccinationRow from '@/components/ConcurrentVaccinationRow.vue'
import MedicalInstitutionDetail from '@/components/MedicalInstitutionDetail.vue'
import MedicalSourceCell from '@/components/MedicalSourceCell.vue'
import ConcurrentVaccinationHelp from '@/components/ConcurrentVaccinationHelp.vue'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = '#2962ff'
AppBarUseHelpPage.value = true
AppBarHelpPageLink.value = 'how-to-search'

const loading = shallowRef(true)
const dataTableItems = shallowRef<IMedicalInstitutionReport[]>()
const medicalInstitutionSummary = shallowRef<IMedicalInstitutionSummary>()
onMounted(() => {
  axios
    .get<IMedicalInstitutionReport[]>(MedicalInstitutionReportsURL)
    .then((response) => {
      dataTableItems.value = response.data
      loading.value = false
    })
    .catch((error) => console.log('failed to get reported pfizer data: ' + error))

  axios
    .get<IMedicalInstitutionMetadata>(MedicalInstitutionMetadataURL)
    .then((response) => {
      genderFilterItems.value = response.data.gender_list
      vaccineNameFilterItems.value = response.data.vaccine_name_list
      manufacturerFilterItems.value = response.data.manufacturer_list
      causualFilterItems.value = response.data.causal_relationship_list
      severityFilterItems.value = response.data.severity_list
      resultFilterItems.value = response.data.gross_results_list
      loading.value = false
    })
    .catch((error) => console.log('failed to get reported pfizer data: ' + error))

  axios
    .get<IMedicalInstitutionSummary>(MedicalInstitutionSummaryURL)
    .then((response) => {
      medicalInstitutionSummary.value = response.data
    })
    .catch((error) => console.log('failed to get medical insutitution summary data: ' + error))
})

const headers = [
  { key: 'data-table-expand', width: 10 },
  { title: '年齢', align: 'start', key: 'age', width: 15 },
  { title: '性別', align: 'start', key: 'gender', width: 15 },
  { title: '接種日', align: 'start', key: 'vaccinated_dates' },
  { title: '症状発生日', align: 'start', key: 'onset_dates' },
  { title: '発症までの日数', align: 'start', key: 'days_to_onset', width: 80 },
  { title: 'ワクチン名', align: 'start', key: 'vaccine_name', width: 200 },
  { title: '製造販売業者', align: 'start', key: 'manufacturer' },
  { title: 'ロット番号', align: 'start', key: 'lot_no' },
  { title: '同時接種', align: 'start', key: 'concurrent_vaccination_flag'},
  { title: '症状名', align: 'start', key: 'PT_names' },
  { title: '因果関係', align: 'start', key: 'causal_relationship' },
  { title: '重篤度', align: 'start', key: 'severity' },
  { title: '転帰日', align: 'start', key: 'gross_result_dates' },
  { title: '転帰内容', align: 'start', key: 'gross_results' },
  { title: '元資料', align: 'start', key: 'source.url' }
]

let expandedArray = shallowRef([])

const manufacturerFilterValues = shallowRef<any[]>([])
const manufacturerFilterItems = shallowRef<string[]>([])
const manufacturerFilterFunc = (value: string): boolean => {
  if (manufacturerFilterValues.value.length == 0) return true
  if (manufacturerFilterValues.value.indexOf(value) > -1) return true
  return false
}

const vaccineNameFilterValues = shallowRef<any[]>([])
const vaccineNameFilterItems = shallowRef<string[]>([])
const vaccineNameFilterFunc = (value: string): boolean => {
  if (vaccineNameFilterValues.value.length == 0) return true
  if (vaccineNameFilterValues.value.indexOf(value) > -1) return true
  return false
}

const lotNoFilterVal = shallowRef('')
const lotNoFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, lotNoFilterVal)
}

const ageFromFilterVal = shallowRef('')
const ageToFilterVal = shallowRef('')
const ageFilterFunc = (value: any): boolean => {
  return NumberFilterFunc(value, ageFromFilterVal, ageToFilterVal)
}

const genderFilterValues = shallowRef<any[]>([])
const genderFilterItems = shallowRef<string[]>([])
const genderFilterFunc = (value: string): boolean => {
  if (genderFilterValues.value.length == 0) return true
  if (genderFilterValues.value.indexOf(value) > -1) return true
  return false
}

const vaccinatedDateFromFilterVal = shallowRef('')
const vaccinatedDateToFilterVal = shallowRef('')
const vaccinatedDateFilterFunc = (value: any): boolean => {
  return DateArrayFilterFunc(value, vaccinatedDateFromFilterVal, vaccinatedDateToFilterVal)
}

const daysToOnsetFromFilterVal = shallowRef('')
const daysToOnsetToFilterVal = shallowRef('')
const daysToOnsetFilterFunc = (value: any): boolean => {
  return NumberFilterFunc(value, daysToOnsetFromFilterVal, daysToOnsetToFilterVal)
}

const ptNameFilterVal = shallowRef('')
const ptNameFilterFunc = (value: any): boolean => {
  return StringArrayFilterFunc(value, ptNameFilterVal)
}

const causualFilterValues = shallowRef<any[]>([])
const causualFilterItems = shallowRef<string[]>([])
const causualFilterFunc = (value: any): boolean => {
  if (causualFilterValues.value.length == 0) return true
  if (causualFilterValues.value.indexOf(value) > -1) return true
  return false
}

const severityFilterValues = shallowRef<any[]>([])
const severityFilterItems = shallowRef<string[]>([])
const severityFilterFunc = (value: string): boolean => {
  if (severityFilterValues.value.length == 0) return true
  if (severityFilterValues.value.indexOf(value) > -1) return true
  return false
}

const resultDateFromFilterVal = shallowRef('')
const resultDateToFilterVal = shallowRef('')
const resultDateFilterFunc = (value: any): boolean => {
  return DateArrayFilterFunc(value, resultDateFromFilterVal, resultDateToFilterVal)
}

const resultFilterValues = shallowRef<any[]>([])
const resultFilterItems = shallowRef<string[]>([])
const resultFilterFunc = (value: any): boolean => {
  if (resultFilterValues.value.length == 0) return true
  for (let index = 0; index < value.length; index++) {
    if(resultFilterValues.value.indexOf(value[index]) > -1){
      return true
    }
  }
  return false
}

const customKeyFilter = {
  age: ageFilterFunc,
  gender: genderFilterFunc,
  vaccinated_dates: vaccinatedDateFilterFunc,
  days_to_onset: daysToOnsetFilterFunc,
  vaccine_name: vaccineNameFilterFunc,
  manufacturer: manufacturerFilterFunc,
  lot_no: lotNoFilterFunc,
  PT_names: ptNameFilterFunc,
  causal_relationship: causualFilterFunc,
  severity: severityFilterFunc,
  gross_result_dates: resultDateFilterFunc,
  gross_results: resultFilterFunc
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
  {name: "mk", val: manufacturerFilterValues},
  {name: "vn", val: vaccineNameFilterValues},
  {name: "ln", val: lotNoFilterVal},
  {name: "adf", val: ageFromFilterVal},
  {name: "adt", val: ageToFilterVal},
  {name: "gen", val: genderFilterValues},
  {name: "vdf", val: vaccinatedDateFromFilterVal},
  {name: "vdt", val: vaccinatedDateToFilterVal},
  {name: "dtof", val: daysToOnsetFromFilterVal},
  {name: "dtot", val: daysToOnsetToFilterVal},
  {name: "pt", val: ptNameFilterVal},
  {name: "cr", val: causualFilterValues},
  {name: "sv", val: severityFilterValues},
  {name: "rdf", val: resultDateFromFilterVal},
  {name: "rdt", val: resultDateToFilterVal},
  {name: "re", val: resultFilterValues},
]
searchConditionChanged.value = ParseQueryParams(queryParamMap, pageQueryParams)

const copyUrlWithQueryParams = () => {
  const retUrl = CreateUrlWithQueryParams(queryParamMap)
  if(navigator.clipboard){
    navigator.clipboard.writeText(retUrl);
  }
}

const _blank = shallowRef()
const vaccineSearchItems = [
  { md: 4, label: "製造販売業者", model: _blank, type: "manufacturer"},
  { md: 4, label: "ワクチン名", model: _blank, type: "vaccine_name"},
  { md: 4, label: "ロット番号", model: lotNoFilterVal, type: "text"}
]
const individualSearchItems = [
  { md: 4, label: "年齢", model: _blank, type: "age-range"},
  { md: 4, label: "性別", model: _blank, type: "gender"},
  { md: 4, label: "接種日", model: _blank, type: "vaccinated_date"},
  { md: 4, label: "発症までの日数", model: _blank, type: "days_to_onset"},
  { md: 4, label: "症状名(PT名)", model: ptNameFilterVal, type: "text"},
  { md: 4, label: "因果関係", model: _blank, type: "causal_relationship"},
  { md: 4, label: "重篤度", model: _blank, type: "severity"},
  { md: 4, label: "転帰日", model: _blank, type: "result_date"},
  { md: 4, label: "転帰内容", model: _blank, type: "result",},
]

const downloadFilterdDataAsCsv = () => {
  if(dataTableItems.value === undefined) return

  const filteredData : IMedicalInstitutionReport[] = []
  for (let index = 0; index < dataTableItems.value.length; index++) {
    const rowItem = dataTableItems.value[index]
    let showThisRow = true

    // customKeyFilterによるフィルタ処理と同等の処理を行う
    if(!ageFilterFunc(rowItem.age)) showThisRow=false
    if(!genderFilterFunc(rowItem.gender)) showThisRow=false
    if(!vaccinatedDateFilterFunc(rowItem.vaccinated_dates)) showThisRow=false
    if(!daysToOnsetFilterFunc(rowItem.days_to_onset)) showThisRow=false
    if(!vaccineNameFilterFunc(rowItem.vaccine_name)) showThisRow=false
    if(!manufacturerFilterFunc(rowItem.manufacturer)) showThisRow=false
    if(!lotNoFilterFunc(rowItem.lot_no)) showThisRow=false
    if(!ptNameFilterFunc(rowItem.PT_names)) showThisRow=false
    if(!causualFilterFunc(rowItem.causal_relationship)) showThisRow=false
    if(!severityFilterFunc(rowItem.severity)) showThisRow=false
    if(!resultDateFilterFunc(rowItem.gross_result_dates)) showThisRow=false
    if(!resultFilterFunc(rowItem.gross_results)) showThisRow=false

    if(showThisRow) filteredData.push(rowItem)
  }

  const headerTitles = headers.filter(head => head.title != undefined).map( head => head.title).join(',')
  const headerKeys = headers.filter(head => head.title != undefined).map( head => head.key)
  const csvContent = CreateCsvContentRaw<IMedicalInstitutionReport>(filteredData, headerTitles, headerKeys)

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

.underline{
  text-underline-offset: 0.2rem;
  text-decoration-line: underline;
  text-decoration-color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  text-decoration-thickness: 1.2px;
}
</style>

<style>
.expanded-row-style {
  border: medium dashed green;
  background-color: beige !important;
}
</style>

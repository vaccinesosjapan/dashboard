<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title color="#66BB6A">
        <v-icon class="search-icon">mdi-magnify</v-icon>
        <span class="search-title">詳細検索...</span>
        <v-spacer></v-spacer>
        <v-chip v-if="searchConditionChanged" size="small" variant="elevated" color="orange-lighten-3">検索ワード入力中</v-chip>
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <h6 class="text-h6">症状など申請に関する条件の設定</h6>
        <v-row align="end">
          <v-col v-for="sItem, i in issueSearchItems" :key="i" cols="12" :md="sItem.md" class="group">

            <SelectItems v-if="sItem.type == 'judged_result'"
            v-model:values="judgedResultFilterValues" v-model:items="judgedResultFilterItems"
            :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
            label="判定"
            ></SelectItems>

            <SelectItems v-else-if="sItem.type == 'reasons'"
            v-model:values="reasonsForRepudiationValues" v-model:items="reasonsForRepudiationItems"
            :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
            label="判定理由"
            ></SelectItems>

            <v-dialog v-else-if="sItem.type == 'reasons-help'" transition="dialog-bottom-transition" width="auto">
              <template v-slot:activator="{ props }">
                <v-btn outlined height="3rem" prepend-icon="mdi-help-circle-outline" v-bind="props">否認理由に<br>ついて...</v-btn>
              </template>

              <template v-slot:default="{ isActive }">
                <ReasonsForRepudiationCard :close-func="()=>{isActive.value = false}"></ReasonsForRepudiationCard>
              </template>
            </v-dialog>

            <SelectItems v-else-if="sItem.type == 'judged-date'"
            v-model:values="judgedDatesFilterValues" v-model:items="judgedDatesFilterItems"
            :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
            label="判定日（選択した日付のみ）"
            ></SelectItems>

            <v-text-field v-else
              :label="sItem.label"
              v-model="sItem.model.value"
              :type="sItem.type"
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
            <NumberFilter v-if="item.type == 'age-range'"
            :title="item.label"
            v-model:min="ageFromFilterVal"
            v-model:max="ageToFilterVal"
            :search-triger-func="searchTrigerFunc"
            :clear-trigger-func="clearTriggerFunc"
            ></NumberFilter>

            <SelectItems v-else-if="item.type == 'gender'"
            v-model:values="genderFilterValues" v-model:items="genderFilterItems"
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
      <SearchRelatedToolBar btn-color="green-darken-3" :copy-func="copyUrlWithQueryParams" :download-func="downloadFilteredDataAsCsv" :clear-func="clearFilter"></SearchRelatedToolBar>
    </v-expansion-panel>

  </v-expansion-panels>
  <br />

  <v-data-table
    loading-text="データを読み込み中です。"
    :loading="loading"
    :items="dataTableItems as any"
    :headers="headers as any "
    :search="SearchTrigger"
    :custom-filter="
      () => {
        return true
      }
    "
    density="compact"
    class="data-table-health-hazard"
    show-expand
    expand-on-click
    item-value="no"
    v-model:expanded="expandedArray"
    :custom-key-filter="customKeyFilter"
    items-per-page-text="ページに表示する項目数"
  >
    <template v-slot:[`item.age`]="item">
      <span>{{ item.value.join(', ') }}</span>
    </template>

    <template v-slot:[`item.symptoms`]="item">
      <StringArrayRow :s-array="item.value"></StringArrayRow>
    </template>

    <template v-slot:[`item.description_of_claim`]="item">
      <BillingDetailsChip :description_of_claim="item.value"></BillingDetailsChip>
    </template>

    <template v-slot:[`item.pre_existing_conditions`]="item">
      <StringArrayRow :s-array="item.value"></StringArrayRow>
    </template>

    <template v-slot:[`item.reasons_for_repudiation`]="item">
      <span>{{ item.value.join(', ') }}</span>
    </template>

    <template v-slot:[`item.source_url`]="item">
      <a :href="item.value">リンク</a>
    </template>

    <template v-slot:expanded-row="{ item }">
      <td :colspan="headers.length + 1">
        <v-row>
          <v-col cols="12" md="6">
            <SymptomsCard :symptoms="item.symptoms" :click-close="() => { expandedArray = expandedArray.filter( n => n !== item.no )}"></SymptomsCard>
          </v-col>
          <v-col cols="12" md="6">
            <PreExistingDiseaseCard title="基礎疾患一覧" :pre_existing_disease_names="item.pre_existing_conditions"></PreExistingDiseaseCard>
          </v-col>
        </v-row>
      </td>
    </template>

  </v-data-table>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import axios from 'axios'
import router from '@/router/index'
import { AppBarTitle, AppBarColor, CertifiedHealthHazardDataURL, CertifiedMetadataURL } from '@/router/data'
import type { ICertifiedHealthHazardIssue } from '@/types/CertifiedHealthHazard'
import type { IQueryParam } from '@/types/QueryParam'
import { ClearFilterValues, CreateUrlWithQueryParams, IsConditionChanged, ParseQueryParams } from '@/types/QueryParam'
import { CreateCsvContentRaw, DownloadCsvFile } from '@/types/FilteredDataAsCsv'
import type { ICertifiedMetadata } from '@/types/CertifiedMetadata'
import { StringFilterFunc, StringArrayFilterFunc, NumberArrayFilterFunc } from '@/tools/FilterFunc'
import { SearchTrigger, SearchTriggerFunc } from '@/tools/SearchTriggerFunc'
import StringArrayRow from '@/components/StringArrayRow.vue'
import PreExistingDiseaseCard from '@/components/PreExistingDiseaseCard.vue'
import ReasonsForRepudiationCard from '@/components/ReasonsForRepudiationCard.vue'
import NumberFilter from '@/components/NumberFilter.vue'
import SymptomsCard from '@/components/SymptomsCard.vue'
import SelectItems from '@/components/SelectItems.vue'
import BillingDetailsChip from '@/components/BillingDetailsChip.vue'
import SearchRelatedToolBar from '@/components/SearchRelatedToolBar.vue'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = 'green'

const loading = shallowRef(true)
const dataTableItems = shallowRef<ICertifiedHealthHazardIssue[]>()
onMounted(() => {
  axios
    .get<ICertifiedHealthHazardIssue[]>(CertifiedHealthHazardDataURL)
    .then((response) => {
      dataTableItems.value = response.data
      loading.value = false
    })
    .catch((error) => console.log('failed to get certified heallth hazard data: ' + error))

  axios
    .get<ICertifiedMetadata>(CertifiedMetadataURL)
    .then((response) => {
      judgedDatesFilterItems.value = response.data.judged_dates
      judgedResultFilterItems.value = response.data.judged_result_list
      genderFilterItems.value = response.data.gender_list
      loading.value = false
    })
    .catch((error) => console.log('failed to get certified metadata: ' + error))
})

const headers = [
  { key: 'data-table-expand', width: 20 },
  { title: '判定日', align: 'start', key: 'certified_date', width: 120 },
  { title: '性別', align: 'start', key: 'gender', width: 25},
  { title: '年齢', align: 'start', key: 'age', width: 25 },
  { title: 'ワクチン名', align: 'start', key: 'vaccine_name', width: 110 },
  { title: '請求内容', align: 'start', key: 'description_of_claim', width: 170 },
  { title: '症状', align: 'start', key: 'symptoms' },
  { title: '基礎疾患', align: 'start', key: 'pre_existing_conditions' },
  { title: '判定', align: 'start', key: 'judgment_result', width: 25 },
  { title: '否認理由', align: 'start', key: 'reasons_for_repudiation', width: 110 },
  { title: '元資料', align: 'start', key: 'source_url', width: 100},
]

const expandedArray = shallowRef<string[]>([])

const vaccineNameFilterVal = shallowRef('')
const vaccineNameFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, vaccineNameFilterVal)
}

const symptomsFilterVal = shallowRef('')
const symptomsFilterFunc = (values: any): boolean => {
  return StringArrayFilterFunc(values, symptomsFilterVal)
}

const descriptionOfClaimFilterVal = shallowRef('')
const descriptionOfClaimFilterFunc = (value: string): boolean => {
  return StringFilterFunc(value, descriptionOfClaimFilterVal)
}

const judgedResultFilterValues = shallowRef<string[]>([])
const judgedResultFilterItems = shallowRef<string[]>([])
const judgmentResultFilterFunc = (value: string): boolean => {
  if (judgedResultFilterValues.value.length == 0) return true
  if (judgedResultFilterValues.value.indexOf(value) > -1) return true
  return false
}

const judgedDatesFilterValues = shallowRef<string[]>([])
const judgedDatesFilterItems = shallowRef<string[]>([])
const judgedDatesFilterFunc = (value: any): boolean => {
  if(judgedDatesFilterValues.value.length == 0) return true
  if(value.length == 0) return false // 検索しようとしているが対象列の内容が空っぽの場合なので非表示

  return judgedDatesFilterValues.value.includes(value)
}

const ageFromFilterVal = shallowRef<any>('')
const ageToFilterVal = shallowRef<any>('')
const ageFilterFunc = (values: any): boolean => {
  return NumberArrayFilterFunc(values, ageFromFilterVal, ageToFilterVal)
}

const genderFilterValues = shallowRef<any[]>([])
const genderFilterItems = shallowRef<string[]>([])
const genderFilterFunc = (value: string): boolean => {
  if (genderFilterValues.value.length == 0) return true
  if (genderFilterValues.value.indexOf(value) > -1) return true
  return false
}

const preExistingConditionFilterVal = shallowRef('')
const preExistingConditionFilterFunc = (value: any): boolean => {
  return StringArrayFilterFunc(value, preExistingConditionFilterVal)
}

const reasonsForRepudiationItems = ['TypeA-1', 'TypeA-2', 'TypeA-3', 'TypeA-4', 'TypeA-5', 'TypeB-1', 'TypeB-2', 'TypeB-3', 'TypeB-4']
const reasonsForRepudiationValues = shallowRef<any>([])
const reasonsForRepudiationFilterFunc = (value: any): boolean => {
  if(reasonsForRepudiationValues.value.length == 0) return true
  if(value.length == 0) return false // 検索しようとしているが対象列の内容が空っぽの場合なので非表示

  for (let index = 0; index < value.length; index++) {
    if(reasonsForRepudiationValues.value.indexOf(value[index]) > -1){
      return true
    }
  }

  return false
}

const searchConditionChanged = shallowRef<boolean>(false)
const searchTrigerFunc = () => {
  SearchTriggerFunc()
  searchConditionChanged.value = IsConditionChanged(queryParamMap)
}
const clearTriggerFunc = () => {
  searchConditionChanged.value = IsConditionChanged(queryParamMap)
}

// 詳細検索の入力欄を作るための設定たち
const _blank = shallowRef()
const issueSearchItems = [
  { md: 6, label: "請求内容", model: descriptionOfClaimFilterVal, type: "text"},
  { md: 6, label: "症状", model: symptomsFilterVal, type: "text"},
  { md: 2, label: "判定", model: _blank, type: "judged_result"},
  { md: 2, label: "否認理由", model: _blank , type: "reasons"},
  { md: 2, label: "", model: _blank , type: "reasons-help"},
  { md: 6, label: "判定日（選択した日付のみ）", model: _blank, type: "judged-date"},
]
const individualSearchItems = [
  { md: 4, label: "年齢（最小/最大でフィルタ）", model: _blank, type: "age-range"},
  { md: 4, label: "性別", model: _blank, type: "gender"},
  { md: 4, label: "基礎疾患", model: preExistingConditionFilterVal, type: "text"},
]

// URLのクエリパラメータを検索用のデータに
const pageQueryParams = router.currentRoute.value.query
const queryParamMap: IQueryParam[] = [
  {name: "jdf", val: judgedDatesFilterValues},
  {name: "gen", val: genderFilterValues},
  {name: "adf", val: ageFromFilterVal},
  {name: "adt", val: ageToFilterVal},
  {name: "vn", val: vaccineNameFilterVal},
  {name: "tp", val: descriptionOfClaimFilterVal},
  {name: "sym", val: symptomsFilterVal},
  {name: "re", val: judgedResultFilterValues},
  {name: "pre", val: preExistingConditionFilterVal},
  {name: "rea", val: reasonsForRepudiationValues}
]
searchConditionChanged.value = ParseQueryParams(queryParamMap, pageQueryParams)

const copyUrlWithQueryParams = () => {
  const retUrl = CreateUrlWithQueryParams(queryParamMap)
  if(navigator.clipboard){
    navigator.clipboard.writeText(retUrl);
  }
}

// v-data-tableに対してフィルタ処理を行うための設定たち
const customKeyFilter = {
  certified_date: judgedDatesFilterFunc,
  gender: genderFilterFunc,
  age: ageFilterFunc,
  vaccine_name: vaccineNameFilterFunc,
  description_of_claim: descriptionOfClaimFilterFunc,
  symptoms: symptomsFilterFunc,
  judgment_result: judgmentResultFilterFunc,
  pre_existing_conditions: preExistingConditionFilterFunc,
  reasons_for_repudiation: reasonsForRepudiationFilterFunc
}

const downloadFilteredDataAsCsv = () => {
  if(dataTableItems.value === undefined) return

  const filteredData : ICertifiedHealthHazardIssue[] = []
  for (let index = 0; index < dataTableItems.value.length; index++) {
    const rowItem = dataTableItems.value[index]
    let showThisRow = true

    // customKeyFilterによるフィルタ処理と同等の処理を行う
    if(!judgedDatesFilterFunc(rowItem.certified_date)) showThisRow=false
    if(!genderFilterFunc(rowItem.gender)) showThisRow=false
    if(!ageFilterFunc(rowItem.age)) showThisRow=false
    if(!vaccineNameFilterFunc(rowItem.vaccine_name)) showThisRow=false
    if(!descriptionOfClaimFilterFunc(rowItem.description_of_claim)) showThisRow=false
    if(!symptomsFilterFunc(rowItem.symptoms)) showThisRow=false
    if(!judgmentResultFilterFunc(rowItem.judgment_result)) showThisRow=false
    if(!preExistingConditionFilterFunc(rowItem.pre_existing_conditions)) showThisRow=false
    if(!reasonsForRepudiationFilterFunc(rowItem.reasons_for_repudiation)) showThisRow=false

    if(showThisRow) filteredData.push(rowItem)
  }
  const headerTitles = headers.filter(head => head.title != undefined).map( head => head.title).join(',')
  const headerKeys = headers.filter(head => head.title != undefined).map( head => head.key)
  const csvContent = CreateCsvContentRaw<ICertifiedHealthHazardIssue>(filteredData, headerTitles, headerKeys)

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

.search-icon {
  font-size: 2rem;
}
.search-title {
  font-size: 1.5rem;
  padding-left: 0.8rem;
}
</style>

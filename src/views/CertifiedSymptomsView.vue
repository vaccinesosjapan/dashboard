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
        <v-row align="end">
          <v-col cols="12" md="6" class="group">
            <SearchableSelectItems
              v-model:values="symptomsFilterValues" v-model:items="symptomsFilterItems"
              :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
              label="症状"
            ></SearchableSelectItems>
          </v-col>

          <v-col cols="12" md="6" class="group">
            <NumberFilter
            v-model:min="sumFromFilterVal" v-model:max="sumToFilterVal" :search-triger-func="searchTrigerFunc" :clear-trigger-func="clearTriggerFunc"
            title="合計件数"
            ></NumberFilter>
          </v-col>
        </v-row>
      </v-expansion-panel-text>

    </v-expansion-panel>

    <v-expansion-panel>
      <SearchRelatedToolBar btn-color="green-darken-3" :copy-func="copyUrlWithQueryParams" :download-func="downloadFilterdDataAsCsv" :clear-func="clearFilter"></SearchRelatedToolBar>
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
    class="data-table-health-hazard"
    :custom-key-filter="{
      name: symptomsFilterFunc,
      'counts.sum': sumFilterFunc
    }"
    items-per-page-text="ページに表示する項目数"
  >
    <template v-slot:[`item.name`]="item">
      <v-btn variant="text" color="deep-purple-darken-1" @click="navigateWithQuery(item.value)" class="text-none"><b>{{ item.value }}</b></v-btn>
      <span></span>
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import axios from 'axios'
import router from '@/router/index'
import { AppBarTitle, AppBarColor, CertifiedSymptomsDataURL, CertifiedSymptomsMetadataURL } from '@/router/data'
import type { ICertifiedSymptom } from '@/types/CertifiedSymptom'
import type { IQueryParam } from '@/types/QueryParam'
import { ClearFilterValues, CreateUrlWithQueryParams, IsConditionChanged, ParseQueryParams } from '@/types/QueryParam'
import { CreateCsvContentRaw, DownloadCsvFile } from '@/types/FilteredDataAsCsv'
import type { ICertifiedSymptomsMetadata } from '@/types/CertifiedSymptomMetadata'
import { NumberFilterFunc } from '@/tools/FilterFunc'
import { SearchTrigger, SearchTriggerFunc } from '@/tools/SearchTriggerFunc'
import SearchRelatedToolBar from '@/components/SearchRelatedToolBar.vue'
import SearchableSelectItems from '@/components/SearchableSelectItems.vue'
import NumberFilter from '@/components/NumberFilter.vue'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = 'green'

const loading = shallowRef(true)
const dataTableItems = shallowRef<ICertifiedSymptom[]>()
onMounted(() => {
  axios
    .get<ICertifiedSymptom[]>(CertifiedSymptomsDataURL)
    .then((response) => {
      dataTableItems.value = response.data
      loading.value = false
    })
    .catch((error) => console.log('failed to get certified symptoms data: ' + error))
  
  axios
    .get<ICertifiedSymptomsMetadata>(CertifiedSymptomsMetadataURL)
    .then((response) => {
      symptomsFilterItems.value = response.data.symptom_name_list
      loading.value = false
    })
    .catch((error) => console.log('failed to get certified symptom data: ' + error))
})

const headers = [
  { title: '症状', align: 'start', key: 'name' },
  { title: '件数 (男性)', align: 'end', key: 'counts.male' },
  { title: '件数 (女性)', align: 'end', key: 'counts.female' },
  { title: '合計件数', align: 'end', key: 'counts.sum' }
]

// todo: Navigate先のURLをここに直書きしているため、routes側を変更時に一致しなくなる可能性が・・
const navigateWithQuery = (value: string) => {
  router.push({ path: 'certified-issues', query: { sym: value } })
}

const symptomsFilterValues = shallowRef<any[]>([])
const symptomsFilterItems = shallowRef<string[]>([])
const symptomsFilterFunc = (value: string): boolean => {
  if (symptomsFilterValues.value.length == 0) return true
  if (symptomsFilterValues.value.indexOf(value) > -1) return true
  return false
}

const sumFromFilterVal = shallowRef<any>('')
const sumToFilterVal = shallowRef<any>('')
const sumFilterFunc = (value: any): boolean => {
  return NumberFilterFunc(value, sumFromFilterVal, sumToFilterVal)
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
  {name: "sym", val: symptomsFilterValues},
  {name: "sf", val: sumFromFilterVal},
  {name: "st", val: sumToFilterVal},
]
searchConditionChanged.value = ParseQueryParams(queryParamMap, pageQueryParams)

const copyUrlWithQueryParams = () => {
  const retUrl = CreateUrlWithQueryParams(queryParamMap)
  if(navigator.clipboard){
    navigator.clipboard.writeText(retUrl);
  }
}

const downloadFilterdDataAsCsv = () => {
  if(dataTableItems.value === undefined) return

  const filteredData : ICertifiedSymptom[] = []
  for (let index = 0; index < dataTableItems.value.length; index++) {
    const rowItem = dataTableItems.value[index]
    let showThisRow = true

    // customKeyFilterによるフィルタ処理と同等の処理を行う
    if(!symptomsFilterFunc(rowItem.name)) showThisRow=false
    if(!sumFilterFunc(rowItem.counts.sum)) showThisRow=false

    if(showThisRow) filteredData.push(rowItem)
  }

  const headerTitles = headers.filter(head => head.title != undefined).map( head => head.title).join(',')
  const headerKeys = headers.filter(head => head.title != undefined).map( head => head.key)
  const csvContent = CreateCsvContentRaw<ICertifiedSymptom>(filteredData, headerTitles, headerKeys)

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

.hosoku {
  margin-top: auto;
}
</style>

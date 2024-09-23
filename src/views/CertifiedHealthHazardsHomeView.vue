<template>
  <v-container fluid>

    <v-container v-if="!certifiedSummaryLoaded || items == undefined">
      <v-progress-circular
        color="primary"
        indeterminate
        :size="100"
        :width="10"
      ></v-progress-circular>
    </v-container>
    <v-container v-else>
      <CustomHeader1 title="判定結果"></CustomHeader1>
      <p class="text-body-1 mb-2">進達受理件数の総数 <b>{{ items.total_entries.toLocaleString() }}</b> [件] に対して、判定結果の割合は以下の通りです。</p>

      <div class="d-flex justify-end">
        <v-btn size="small" @click="changeChartView" color="blue" v-if="isPersentView">件数を表示</v-btn>
        <v-btn size="small" @click="changeChartView" color="blue" v-else >割合を表示</v-btn>
      </div>

      <v-row>
        <v-col cols="12" sm="6">
          <apexchart :options="judgementChartOptions" :series="judgementChartSeries" ></apexchart>
        </v-col>

        <v-col cols="12" sm="6">
          <v-table density="comfortable">
            <thead>
              <tr>
                <th class="text-left">判定結果</th>
                <th class="text-left">件数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in judgementTableSeries" :key="item.name">
                <td v-if="item.name == '合計'"><b>{{ item.name }}</b></td>
                <td v-else><v-chip variant="flat" :color="selectItemColor(item.name)">{{ item.name }}</v-chip></td>

                <td class="text-right" v-if="item.name == '合計'"><b>{{ item.data.toLocaleString() }}</b></td>
                <td class="text-right" v-else>{{ item.data.toLocaleString() }}</td>
              </tr>
            </tbody>
          </v-table>
          <p class="text-caption text-right">※ 未処理の <b>{{ items?.open_cases_count.toLocaleString() }}</b> [件] を除いた合計件数です。</p>
        </v-col>
      </v-row>
      <p class="text-caption text-right">※ <b>{{ items?.date }}</b> までの「疾病・障害認定審査会」累計データを用いて算出しています。</p>
      <br>
      <br>

      <CustomHeader1 title="申請内容"></CustomHeader1>
      <p class="text-body-1 mb-2">認定・否認された申請の総数 <b>{{ certified_and_denied_count.toLocaleString() }}</b> [件] に対して、申請内容の内訳はそれぞれ以下の通りです。</p>

      <div class="d-flex justify-end">
        <v-btn size="small" @click="changeChartView" color="blue" v-if="isPersentView">件数を表示</v-btn>
        <v-btn size="small" @click="changeChartView" color="blue" v-else>割合を表示</v-btn>
      </div>
      
      <v-row>
        <v-col cols="12" sm="6">
          <apexchart :options="certifiedClaimChartOptions" :series="certifiedClaimChartSeries"></apexchart>
        </v-col>

        <v-col cols="12" sm="6">
          <apexchart :options="deniedClaimChartOptions" :series="deniedClaimChartSeries"></apexchart>
        </v-col>
      </v-row>
      <p class="text-caption text-right">※ <b>{{ items?.date }}</b> までの「疾病・障害認定審査会」累計データを用いて算出しています。</p>
    </v-container>

    <v-container v-if="!judgedDataLoaded || items == undefined">
      <v-progress-circular
        color="primary"
        indeterminate
        :size="100"
        :width="10"
      ></v-progress-circular>
    </v-container>
    <v-container v-else>
      <CustomHeader1 title="審議会の傾向"></CustomHeader1>
      <p class="text-body-1 mb-2">各審議会での件数および認定比率や、全審議会における累計の件数および認定比率は以下の通りです。</p>

      <CountAndRateGraph :data="judgedDataArray"
      :each-info="eachCountAndRateGraphInfo" :each-alt-image-path="JudgedDataEachGraphSmallImageURL"
      :all-info="allCountAndRateGraphInfo" :all-alt-image-path="JudgedDataAllGraphSmallImageURL"
      ></CountAndRateGraph>

      <p class="text-caption text-right">※ <b>{{ items?.date }}</b> までの「疾病・障害認定審査会」累計データを用いて算出しています。</p>
    </v-container>
    
    <v-container v-if="!trendsLoaded">
      <v-progress-circular
        color="primary"
        indeterminate
        :size="100"
        :width="10"
      ></v-progress-circular>
    </v-container>
    <v-container v-else>
      <CustomHeader1 title="性別ごとの症状傾向"></CustomHeader1>
      <p>女性・男性・両方の3つの区分で、どのような症状が多く認定されているのかを以下に示します。</p>
      <v-row>
        <v-col cols="12">
          <JudgedTrendsGraph title="女性の認定症状 上位10種" :series="trendsFemaleSeries"></JudgedTrendsGraph>
        </v-col>

        <v-col cols="12">
          <JudgedTrendsGraph title="男性の認定症状 上位10種" :series="trendsMaleSeries"></JudgedTrendsGraph>
        </v-col>

        <v-col cols="12">
          <JudgedTrendsGraph title="認定症状 上位10種" :series="trendsSumSeries"></JudgedTrendsGraph>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-if="!otherVaccinesLoaded || summaryWithOtherVaccines == undefined">
      <v-progress-circular
        color="primary"
        indeterminate
        :size="100"
        :width="10"
      ></v-progress-circular>
    </v-container>
    <v-container v-else>
      <CustomHeader1 title="過去の各種ワクチンの認定件数との比較"></CustomHeader1>
     
      <v-row>
        <v-col cols="12" class="d-flex justify-center">
          <v-table density="comfortable">
            <thead>
              <tr>
                <th class="text-body-2 text-md-subtitle-1">ワクチン種類</th>
                <th class="text-body-2 text-md-subtitle-1">集計期間</th>
                <th class="text-body-2 text-md-subtitle-1">認定件数</th>
                <th class="text-body-2 text-md-subtitle-1">元資料</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="text-body-2 text-md-subtitle-1">過去の各種ワクチン</span></td>
                <td><span class="text-body-2 text-md-subtitle-1">{{ summaryWithOtherVaccines.meta_data.other_vaccines.period }}（{{summaryWithOtherVaccines.meta_data.other_vaccines.first_date}}～{{summaryWithOtherVaccines.meta_data.other_vaccines.last_date}}）</span></td>
                <td class="text-right"><span class="text-body-2 text-md-subtitle-1"><b class="text-right">{{ summaryWithOtherVaccines.meta_data.other_vaccines.certified_count.toLocaleString() }} [件]</b></span></td>
                <td><span class="text-body-2 text-md-subtitle-1"><a :href="summaryWithOtherVaccines.meta_data.other_vaccines.source_url">元資料</a></span></td>
              </tr>
              <tr>
                <td><span class="text-body-2 text-md-subtitle-1">新型コロナワクチン</span></td>
                <td><span class="text-body-2 text-md-subtitle-1">{{ summaryWithOtherVaccines.meta_data.covid19_vaccine.period }}（{{summaryWithOtherVaccines.meta_data.covid19_vaccine.first_date}}～{{summaryWithOtherVaccines.meta_data.covid19_vaccine.last_date}}）</span></td>
                <td class="text-right"><span class="text-body-2 text-md-subtitle-1"><b>{{ summaryWithOtherVaccines.meta_data.covid19_vaccine.certified_count.toLocaleString() }} [件]</b></span></td>
                <td><span class="text-body-2 text-md-subtitle-1"><a :href="summaryWithOtherVaccines.meta_data.covid19_vaccine.source_url">元資料</a></span></td>
              </tr>
            </tbody>
          </v-table>
        </v-col>

        <v-col cols="12">
          <OtherVaccinesGraph :summay-data="summaryWithOtherVaccines" :thumbnail-image-path="CertifiedSummaryWithOtherVaccinesThumbnailURL"></OtherVaccinesGraph>
        </v-col>
      </v-row>
    </v-container>    

  </v-container>

</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import axios from 'axios'
import { AppBarTitle, AppBarColor, CertifiedSummaryURL, CertifiedSummaryWithOtherVaccinesURL, 
  CertifiedTrendsURL, JudgedDataURL, AppBarUseHelpPage, AppBarHelpPageLink,
  JudgedDataEachGraphSmallImageURL, JudgedDataAllGraphSmallImageURL, CertifiedSummaryWithOtherVaccinesThumbnailURL } from '@/router/data'
import router from '@/router/index'
import type { ICertifiedSummary, ICertifiedSummaryWithOtherVaccines } from '@/types/CertifiedSummary'
import type { ICertifiedTrends } from '@/types/CertifiedTrends'
import type { IJudgedData, IJudgedDataGraphInfo } from '@/types/JudgedData'
import CountAndRateGraph from '@/components/CountAndRateGraph.vue'
import CustomHeader1 from '@/components/CustomHeader1.vue'
import JudgedTrendsGraph from '@/components/JudgedTrendsGraph.vue'
import OtherVaccinesGraph from '@/components/OtherVaccinesGraph.vue'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = 'green'
AppBarUseHelpPage.value = true
AppBarHelpPageLink.value = 'how-to-use-summary-page'

const isPersentView = shallowRef(true)

const items = shallowRef<ICertifiedSummary>()
const summaryWithOtherVaccines = shallowRef<ICertifiedSummaryWithOtherVaccines>() 
const certified_and_denied_count = shallowRef<number>(0)
const certifiedSummaryLoaded = shallowRef<boolean>(false)
const trendsLoaded = shallowRef<boolean>(false)
const judgedDataLoaded = shallowRef<boolean>(false)
const judgedDataArray = shallowRef<IJudgedData[]>([])
const emptyJudgedDataGraphInfo: IJudgedDataGraphInfo = {
  GraphTitle:'',
  CountTitle:'',
  RateTitle: '',
  RepudiationSeriesName: '',
  CertifiedSeriesName: '',
  RateSeriesName: '',
  CountYAxisMax: 0
}
const eachCountAndRateGraphInfo = shallowRef<IJudgedDataGraphInfo>(emptyJudgedDataGraphInfo)
const allCountAndRateGraphInfo = shallowRef<IJudgedDataGraphInfo>(emptyJudgedDataGraphInfo)
const judgedDataLabels = shallowRef<string[]>([])
const otherVaccinesLoaded = shallowRef<boolean>(false)
onMounted(() => {
  axios.get<ICertifiedSummary>(CertifiedSummaryURL)
    .then((response) => {
      items.value = response.data

      if(items.value?.certified_count == undefined ||
        items.value?.denied_count == undefined ||
        items.value?.pending_count == undefined ||
        items.value?.open_cases_count == undefined ||
        items.value?.total_entries == undefined ||
        items.value.certified_death_count == undefined ||
        items.value.denied_death_count == undefined
      ) {
        console.log('failed to get certified summary data because some of them are undefined.')
        return
      }
      
      judgementChartSeries.value.push(items.value.certified_count)
      judgementChartSeries.value.push(items.value.denied_count)
      judgementChartSeries.value.push(items.value.pending_count)

      judgementTableSeries.value.push({name: '認定', data: items.value.certified_count})
      judgementTableSeries.value.push({name: '否認', data: items.value.denied_count})
      judgementTableSeries.value.push({name: '保留', data: items.value.pending_count})
      judgementTableSeries.value.push({name: '合計', data: items.value.total_entries - items.value.open_cases_count})

      certified_and_denied_count.value = items.value.certified_count + items.value.denied_count

      certifiedClaimChartSeries.value.push(items.value.certified_count - items.value.certified_death_count)
      certifiedClaimChartSeries.value.push(items.value.certified_death_count)

      deniedClaimChartSeries.value.push(items.value.denied_count - items.value.denied_death_count)
      deniedClaimChartSeries.value.push(items.value.denied_death_count)

      certifiedSummaryLoaded.value = true

      // 2つ目以降のグラフが手動リフレッシュ無しにちゃんと表示されるようにするために必要な処理
      window.dispatchEvent(new Event('resize'))
    })
    .catch((error) => console.log('failed to get certified summary data: ' + error))

  axios.get<ICertifiedTrends>(CertifiedTrendsURL)
    .then(response => {
      trendsFemaleSeries.value = Array.from(response.data.female_counts, (v) => {
        return {x: v.name, y: v.count}
      })
      trendsMaleSeries.value = Array.from(response.data.male_counts, (v) => {
        return {x: v.name, y: v.count}
      })
      trendsSumSeries.value = Array.from(response.data.sum_counts, (v) => {
        return {x: v.name, y: v.count}
      })
      
      trendsLoaded.value = true

      window.dispatchEvent(new Event('resize'))
    })
    .catch((error) => console.log('failed to get certified trends: ' + error))

  axios.get<ICertifiedSummaryWithOtherVaccines>(CertifiedSummaryWithOtherVaccinesURL)
    .then((response) => {
      summaryWithOtherVaccines.value = response.data

      otherVaccinesLoaded.value =  true

      // 2つ目以降のグラフが手動リフレッシュ無しにちゃんと表示されるようにするために必要な処理
      window.dispatchEvent(new Event('resize'))
    })
    .catch((error) => console.log('failed to get certified summary with other vaccines data: ' + error))
  
  axios.get<IJudgedData[]>(JudgedDataURL)
    .then(response => {
      const judgedData = response.data
      judgedDataArray.value = judgedData

      const numberOfCertified :number[] = []
      const numberOfRepudiation :number[] = []
      const numberOfCertifiedRate :number[] = []
      const numberOfCertifiedSum :number[] = []
      const numberOfRepudiationSum :number[] = []
      const numberOfCertifiedRateSum :number[] = []

      for (let index = 0; index < judgedData.length; index++) {
        const element = judgedData[index];
        judgedDataLabels.value.push(element.Date)

        numberOfCertified.push(element.CertifiedCount)
        numberOfRepudiation.push(element.RepudiationCount)
        numberOfCertifiedRate.push(element.CertifiedRate)

        numberOfCertifiedSum.push(element.CertifiedCountSum)
        numberOfRepudiationSum.push(element.RepudiationCountSum)
        numberOfCertifiedRateSum.push(element.CertifiedRateSum)
      }

      eachCountAndRateGraphInfo.value = {
        GraphTitle: '各審議会の審議件数と認定比率',
        CountTitle: '件数 [件]',
        RateTitle: '認定比率 [%]',
        RepudiationSeriesName: '否認件数',
        CertifiedSeriesName: '認定件数',
        RateSeriesName: '認定の比率',
        CountYAxisMax: 350
      }

      allCountAndRateGraphInfo.value = {
        GraphTitle: '累計の審議件数と認定比率',
        CountTitle: '累計の件数 [件]',
        RateTitle: '累計の認定比率 [%]',
        RepudiationSeriesName: '累計の否認件数',
        CertifiedSeriesName: '累計の認定件数',
        RateSeriesName: '累計の認定比率',
        CountYAxisMax: 12000
      }

      judgedDataLoaded.value = true
      window.dispatchEvent(new Event('resize'))
    })
    .catch((error) => console.log('failed to get judged data: ' + error))
})

const trendsFemaleSeries = shallowRef<{x: string, y: number}[]>([])
const trendsMaleSeries = shallowRef<{x: string, y: number}[]>([])
const trendsSumSeries = shallowRef<{x: string, y: number}[]>([])

const judgementTableSeries = shallowRef<any[]>([])
const itemColors = ['#5FAF51', '#F44336', '#F6AD21', '#808080']
const selectItemColor = (name: any): string => {
  switch (name) {
    case '認定':
      return itemColors[0]
    case '否認':
      return itemColors[1]
    case '保留':
      return itemColors[2]
  
    default:
      return itemColors[3]
  }
}

const judgementChartSeries = shallowRef<number[]>([])
const judgementChartOptions = {
  chart: { type: 'pie' },
  labels: ['認定', '否認', '保留'],
  legend: {
    position: 'bottom',
  },
  colors: itemColors,
  tooltip: {
    y: {
        formatter: (val: any) => {
          return (val as number).toLocaleString() + ' 件'
        },
    },
  },
  responsive: [{
    breakpoint: 800,
    options: {
      chart: {
        width: 300
      }
    }
  }],
  dataLabels: {
    formatter: function (val: any, { seriesIndex, dataPointIndex, w } :any ) {
      if(isPersentView.value){
        return val.toFixed(1) + ' %'
      } else {
        return w.config.series[seriesIndex].toLocaleString() + ' 件'
      }
    },
    style: {
      fontSize: '1.2rem',
      colors: ['#212121'],
    },
    background: {
      enabled: true,
      foreColor: '#fff',
    }
  },
  plotOptions: {
    pie: {
      dataLabels: {
        minAngleToShowLabel: 0
      }
    }
  }
}

const certifiedClaimChartSeries = shallowRef<any[]>([])
const certifiedClaimChartOptions = {
  title: {
    text: '認定された案件の内訳',
    align: 'center',
  },
  chart: { type: 'pie' },
  legend: {
    position: 'bottom',
  },
  labels: ['医療費・医療手当 又は 障害年金', '死亡一時金 又は 葬祭料'],
  colors: ['#2962FF', '#FF4081'],
  tooltip: {
    y: {
        formatter: (val: any) => {
          return (val as number).toLocaleString() + ' 件'
        },
    },
  },
  responsive: [{
    breakpoint: 800,
    options: {
      chart: {
        width: 300
      }
    }
  }],
  dataLabels: {
    formatter: function (val: any, { seriesIndex, dataPointIndex, w } :any ) {
      if(isPersentView.value){
        return val.toFixed(1) + ' %'
      } else {
        return w.config.series[seriesIndex].toLocaleString() + ' 件'
      }
    },
    style: {
      fontSize: '1.2rem',
      colors: ['#212121'],
    },
    background: {
      enabled: true,
      foreColor: '#fff',
    }
  }
}

const deniedClaimChartSeries = shallowRef<any[]>([])
const deniedClaimChartOptions = {
  title: {
    text: '否認された案件の内訳',
    align: 'center',

  },
  chart: { type: 'pie' },
  legend: {
    position: 'bottom',
  },
  labels: ['医療費・医療手当 又は 障害年金', '死亡一時金 又は 葬祭料'],
  colors: ['#2962FF', '#FF4081'],
  tooltip: {
    y: {
        formatter: (val: any) => {
          return (val as number).toLocaleString() + ' 件'
        },
    },
  },
  responsive: [{
    breakpoint: 800,
    options: {
      chart: {
        width: 300
      }
    }
  }],
  dataLabels: {
    formatter: function (val: any, { seriesIndex, dataPointIndex, w } :any ) {
      if(isPersentView.value){
        return val.toFixed(1) + ' %'
      } else {
        return w.config.series[seriesIndex].toLocaleString() + ' 件'
      }
    },
    style: {
      fontSize: '1.2rem',
      colors: ['#212121'],
    },
    background: {
      enabled: true,
      foreColor: '#fff',
    }
  }
}

const changeChartView = () => {
  isPersentView.value = !isPersentView.value
  window.dispatchEvent(new Event('resize'))
}
</script>

<style scoped>
h2 {
  margin-bottom: 0.8rem;
}
</style>

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
      <h2 class="text-h4">判定結果</h2>
      <p class="text-body-1">進達受理件数の総数 <b>{{ items.total_entries.toLocaleString() }}</b> [件] に対して、判定結果の割合は以下の通りです。</p>

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

      <h2 class="text-h4">申請内容</h2>
      <p class="text-body-1">認定・否認された申請の総数 <b>{{ certified_and_denied_count.toLocaleString() }}</b> [件] に対して、申請内容の内訳はそれぞれ以下の通りです。</p>

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
      <h2 class="text-h4">審議会の傾向</h2>
      <p class="text-body-1">各審議会での件数および認定比率や、全審議会における累計の件数および認定比率は以下の通りです。</p>

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
      <h2 class="text-h4">性別ごとの症状傾向</h2>
      <p>女性・男性・両方の3つの区分で、どのような症状が多く認定されているのかを以下に示します。</p>
      <v-row>
        <v-col cols="12">
          <apexchart height="400" :options="trendsFemaleChartOptions" :series="[{data: trendsFemaleSeries}]"></apexchart>
        </v-col>

        <v-col cols="12">
          <apexchart height="400" :options="trendsMaleChartOptions" :series="[{data: trendsMaleSeries}]"></apexchart>
        </v-col>

        <v-col cols="12">
          <apexchart height="400" :options="trendsSumChartOptions" :series="[{data: trendsSumSeries}]"></apexchart>
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
      <h2 class="text-h4">過去の各種ワクチンの認定件数との比較</h2>
     
      <v-row>
        <v-col cols="12">
          <v-table density="comfortable">
            <thead>
              <tr>
                <th class="text-left">ワクチン種類</th>
                <th class="text-left">集計期間</th>
                <th class="text-left">認定件数</th>
                <th class="text-left">元資料</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>過去の各種ワクチン</td>
                <td>{{ summaryWithOtherVaccines.meta_data.other_vaccines.period }}（{{summaryWithOtherVaccines.meta_data.other_vaccines.first_date}}～{{summaryWithOtherVaccines.meta_data.other_vaccines.last_date}}）</td>
                <td class="text-right"><b>{{ summaryWithOtherVaccines.meta_data.other_vaccines.certified_count.toLocaleString() }} [件]</b></td>
                <td><a :href="summaryWithOtherVaccines.meta_data.other_vaccines.source_url">元資料</a></td>
              </tr>
              <tr>
                <td>新型コロナワクチン</td>
                <td>{{ summaryWithOtherVaccines.meta_data.covid19_vaccine.period }}（{{summaryWithOtherVaccines.meta_data.covid19_vaccine.first_date}}～{{summaryWithOtherVaccines.meta_data.covid19_vaccine.last_date}}）</td>
                <td class="text-right"><b>{{ summaryWithOtherVaccines.meta_data.covid19_vaccine.certified_count.toLocaleString() }} [件]</b></td>
                <td><a :href="summaryWithOtherVaccines.meta_data.covid19_vaccine.source_url">元資料</a></td>
              </tr>
            </tbody>
          </v-table>
        </v-col>

        <v-col cols="12">
          <apexchart :options="otherVaccinesChartOptions" :series="otherVaccinesChartSeries"></apexchart>
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
  JudgedDataEachGraphSmallImageURL, JudgedDataAllGraphSmallImageURL } from '@/router/data'
import router from '@/router/index'
import type { ICertifiedSummary, ICertifiedSummaryWithOtherVaccines } from '@/types/CertifiedSummary'
import type { ICertifiedTrends } from '@/types/CertifiedTrends'
import { CreateBarChartOption } from '@/tools/ChartOptions'
import type { IJudgedData, IJudgedDataGraphInfo } from '@/types/JudgedData'
import CountAndRateGraph from '@/components/CountAndRateGraph.vue'

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

      for (let index = 0; index < summaryWithOtherVaccines.value.chart_data.data.length; index++) {
        const chartData = summaryWithOtherVaccines.value.chart_data.data[index]

        otherVaccinesChartCategories.value.push(chartData.vaccine_name)
        otherVaccinesChartSeriesMedical.value.push(chartData.medical)
        otherVaccinesChartSeriesDisabilityOfChildren.value.push(chartData.disability_of_children)
        otherVaccinesChartSeriesDisability.value.push(chartData.disability)
        otherVaccinesChartSeriesDeath.value.push(chartData.death)
      }

      otherVaccinesChartSeries.value.push({
        name: summaryWithOtherVaccines.value.chart_data.headers[1],
        data: otherVaccinesChartSeriesMedical.value
      })
      otherVaccinesChartSeries.value.push({
        name: summaryWithOtherVaccines.value.chart_data.headers[2],
        data: otherVaccinesChartSeriesDisabilityOfChildren.value
      })
      otherVaccinesChartSeries.value.push({
        name: summaryWithOtherVaccines.value.chart_data.headers[3],
        data: otherVaccinesChartSeriesDisability.value
      })
      otherVaccinesChartSeries.value.push({
        name: summaryWithOtherVaccines.value.chart_data.headers[4],
        data: otherVaccinesChartSeriesDeath.value
      })

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
        GraphTitle: '各審議会での件数および認定比率',
        CountTitle: '件数 [件]',
        RateTitle: '認定比率 [%]',
        RepudiationSeriesName: '否認件数',
        CertifiedSeriesName: '認定件数',
        RateSeriesName: '認定の比率',
        CountYAxisMax: 350
      }

      allCountAndRateGraphInfo.value = {
        GraphTitle: '累計の件数および累計の認定比率',
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

const trendsFemaleSeries = shallowRef<{x: string, y: number}[]>()
const trendsFemaleChartOptions = CreateBarChartOption('女性の認定症状 上位10種')

const trendsMaleSeries = shallowRef<{x: string, y: number}[]>()
const trendsMaleChartOptions = CreateBarChartOption('男性の認定症状 上位10種')

const trendsSumSeries = shallowRef<{x: string, y: number}[]>()
const trendsSumChartOptions = CreateBarChartOption('認定症状 上位10種')

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
    offsetX: 10,
    offsetY: 10,
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
    offsetX: 10,
    offsetY: 10,
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

const otherVaccinesChartSeriesMedical = shallowRef<number[]>([])
const otherVaccinesChartSeriesDisabilityOfChildren = shallowRef<number[]>([])
const otherVaccinesChartSeriesDisability = shallowRef<number[]>([])
const otherVaccinesChartSeriesDeath = shallowRef<number[]>([])
const otherVaccinesChartSeries = shallowRef<{name: string, data: number[]}[]>([])
const otherVaccinesChartCategories = shallowRef<string[]>([])
const otherVaccinesChartCategoryName = 'ワクチン名'
const downloadFileName = 'certified-summary-with-other-vaccines'
const otherVaccinesChartOptions = {
  title: {
    text: '新型コロナワクチンとその他ワクチンの認定件数まとめ',
    align: 'center',
    offsetX: 10,
    offsetY: 10,
  },
  chart: {
    type: 'bar',
    stacked: true,
    toolbar:{
    export: {
      csv: {
        headerCategory: otherVaccinesChartCategoryName,
        filename: downloadFileName,
      },
      svg: {
        filename: downloadFileName,
      },
      png: {
        filename: downloadFileName,
      }
    }
  }
  },
  legend: {
    position: 'bottom',
  },
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
        height: 600
      }
    }
  }],
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  xaxis: {
    categories: otherVaccinesChartCategories.value,
  },
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

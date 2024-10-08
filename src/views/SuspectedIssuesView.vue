<template>
  <v-container fluid>

    <v-container>
      <CustomHeader1 title="副反応疑い報告"></CustomHeader1>
      <p class="text-body-1">（製造販売業者からの副反応疑い報告に関するまとめをここに掲載予定）</p>
    </v-container>

    <v-container v-if="carditisSummaryData == undefined">
      <v-progress-circular
        color="primary"
        indeterminate
        :size="100"
        :width="10"
      ></v-progress-circular>
    </v-container>

    <v-container v-else>
      <CustomHeader1 title="心筋炎/心膜炎 報告"></CustomHeader1>
      <p class="text-body-1 mb-2">
        「新型コロナワクチン接種後の心筋炎又は心膜炎疑い」として製造販売業者から報告された <span class="big-bold">{{ carditisSummaryData?.carditis_summary.total.toLocaleString() }}</span> [件] の集計結果を示します。
      </p>

      <div class="d-flex justify-end">
        <v-btn size="small" @click="changeChartView" color="blue" v-if="isPersentView">件数を表示</v-btn>
        <v-btn size="small" @click="changeChartView" color="blue" v-else>割合を表示</v-btn>
      </div>

      <v-row class="mb-2">
        <v-col cols="12" md="8">
          <apexchart :options="carditisSummaryOptions" :series="carditisSummarySeries"></apexchart>
        </v-col>
        <v-col cols="12" md="4">
          <v-table density="comfortable">
            <thead>
              <tr>
                <th class="text-left">症状名</th>
                <th class="text-right">件数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="label, index in ['心筋炎', '心膜炎']" :key="label">
                <td style="white-space: pre;">{{ label }}</td>
                <td class="text-right">{{ carditisSummarySeries[index].toLocaleString() }}</td>
              </tr>
              <tr>
                <td><b>合計</b></td>
                <td class="text-right"><b>{{ carditisSummarySeries.reduce(function(a, x){return a + x;}).toLocaleString() }}</b></td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>

      <CustomHeader2 title="心筋炎の件数内訳"></CustomHeader2>
      <div class="d-flex justify-end">
        <v-btn size="small" @click="changeChartView" color="blue" v-if="isPersentView">件数を表示</v-btn>
        <v-btn size="small" @click="changeChartView" color="blue" v-else>割合を表示</v-btn>
      </div>
      <v-row class="mb-2">
        <v-col cols="12" md="8">
          <apexchart :options="myocarditisByVaccineOptions" :series="myocarditisByVaccineSeries"></apexchart>
        </v-col>

        <v-col  cols="12" md="4">
          <v-table density="comfortable">
            <thead>
              <tr>
                <th class="text-left">ワクチン名</th>
                <th class="text-left">心筋炎件数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="label, index in myocarditisByVaccineLabels" :key="label">
                <td class="small-cell">{{ addNewLineWithBrackets(label) }}</td>
                <td class="text-right">{{ myocarditisByVaccineSeries[index].toLocaleString() }}</td>
              </tr>
              <tr>
                <td><b>合計</b></td>
                <td class="text-right text-body-2"><b>{{ myocarditisByVaccineSeries.reduce(function(a, x){return a + x;}).toLocaleString() }}</b></td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>

      <CustomHeader2 title="心膜炎の件数内訳"></CustomHeader2>
      <div class="d-flex justify-end">
        <v-btn size="small" @click="changeChartView" color="blue" v-if="isPersentView">件数を表示</v-btn>
        <v-btn size="small" @click="changeChartView" color="blue" v-else>割合を表示</v-btn>
      </div>
      <v-row>
        <v-col cols="12" md="8">
          <apexchart :options="pericarditisByVaccineOptions" :series="pericarditisByVaccineSeries"></apexchart>
        </v-col>

        <v-col  cols="12" md="4">
          <v-table density="comfortable">
            <thead>
              <tr>
                <th class="text-left">ワクチン名</th>
                <th class="text-left">心膜炎件数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="label, index in pericarditisByVaccineLabels" :key="label">
                <td class="small-cell">{{ addNewLineWithBrackets(label) }}</td>
                <td class="text-right">{{ pericarditisByVaccineSeries[index].toLocaleString() }}</td>
              </tr>
              <tr>
                <td><b>合計</b></td>
                <td class="text-right"><b>{{ pericarditisByVaccineSeries.reduce(function(a, x){return a + x;}).toLocaleString() }}</b></td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>

      <p class="text-caption text-right mt-2">※ 「 <a :href="carditisSummaryData?.carditis_summary.source.url">{{ carditisSummaryData?.carditis_summary.source.name }}</a> 」で
      発表された資料の <b>{{ carditisSummaryData?.carditis_summary.date }}</b> 時点の数値を用いています。</p>
    </v-container>

    <v-container v-if="deathSummaryData == undefined">
      <v-progress-circular
        color="primary"
        indeterminate
        :size="100"
        :width="10"
      ></v-progress-circular>
    </v-container>

    <v-container v-else>
      <CustomHeader1 title="亡くなった方々に関する報告"></CustomHeader1>
      <p class="text-body-1 mb-2">
        「新型コロナワクチン接種後の死亡例」として製造販売業者から報告された事例 <span class="big-bold">{{ deathSummaryData?.death_summary.sum_by_evaluation.total.toLocaleString() }}</span> [件] の集計結果を示します。
      </p>

      <CustomHeader2 title="因果関係評価の内訳"></CustomHeader2>
      <div class="d-flex justify-end">
        <v-btn size="small" @click="changeChartView" color="blue" v-if="isPersentView">件数を表示</v-btn>
        <v-btn size="small" @click="changeChartView" color="blue" v-else>割合を表示</v-btn>
      </div>

      <v-row>
        <v-col cols="12" sm="8">
          <apexchart :options="deathSummaryOptions" :series="deathSummarySeries"></apexchart>
        </v-col>

        <v-col  cols="12" sm="4">
          <v-table density="comfortable">
            <thead>
              <tr>
                <th class="text-left">評価結果</th>
                <th class="text-right">件数</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><v-chip variant="flat" color="#3393FA">α</v-chip></td>
                <td class="text-right">{{ deathSummaryData?.death_summary.sum_by_evaluation.alpha.toLocaleString() }}</td>
              </tr>
              <tr>
                <td><v-chip variant="flat" color="#54E497">β</v-chip></td>
                <td class="text-right">{{ deathSummaryData?.death_summary.sum_by_evaluation.beta.toLocaleString() }}</td>
              </tr>
              <tr>
                <td><v-chip variant="flat" color="#F6AD21">γ</v-chip></td>
                <td class="text-right">{{ deathSummaryData?.death_summary.sum_by_evaluation.gamma.toLocaleString() }}</td>
              </tr>
              <tr>
                <td><b>合計</b></td>
                <td class="text-right"><b>{{ deathSummaryData?.death_summary.sum_by_evaluation.total.toLocaleString() }}</b></td>
              </tr>
            </tbody>
          </v-table>
          <EvaluationResultHelpDialog></EvaluationResultHelpDialog>
        </v-col>

        <v-col cols="12" sm="8">
          <apexchart :options="deathSummaryByVaccineOptions" :series="deathSummaryByVaccineSeries"></apexchart>
        </v-col>

        <v-col  cols="12" sm="4">
          <v-table density="comfortable">
            <thead>
              <tr>
                <th class="text-left">ワクチン名</th>
                <th class="text-right">α・γの件数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="label, index in deathSummaryByVaccineLabels" :key="label">
                <td class="small-cell">{{ addNewLineWithBrackets(label) }}</td>
                <td class="text-right">{{ deathSummaryByVaccineSeries[index].toLocaleString() }}</td>
              </tr>
              <tr>
                <td><b>合計</b></td>
                <td class="text-right"><b>{{ deathSummaryByVaccineSeries.reduce(function(a, x){return a + x;}).toLocaleString() }}</b></td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-if="deathSummaryDataFromReports == undefined">
      <v-progress-circular
        color="primary"
        indeterminate
        :size="100"
        :width="10"
      ></v-progress-circular>
    </v-container>

    <v-container v-else>
      <CustomHeader2 title="年代別の内訳"></CustomHeader2>

      <v-row>
        <v-col cols="12">
          <DeathPerAgeGraph :series="deathSummaryDataFromReports.death_summary_from_reports.sum_by_age"></DeathPerAgeGraph>
        </v-col>
      </v-row>
      
      <p class="text-caption text-right mt-2">※ 「 <a :href="deathSummaryData?.death_summary.source.url">{{ deathSummaryData?.death_summary.source.name }}</a> 」で
      発表された資料の <b>{{ deathSummaryData?.death_summary.date }}</b> 時点の数値を用いています。</p>
    </v-container>

  </v-container>
</template>

<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import axios from 'axios'
import { AppBarTitle, AppBarColor, CarditisSummaryURL, DeathSummaryURL, DeathSummaryFromReportsURL, AppBarUseHelpPage, AppBarHelpPageLink } from '@/router/data'
import router from '@/router/index'
import type { ICarditisSummaryRoot } from '@/types/CarditisSummary'
import type { IDeathSummaryRoot } from '@/types/DeathSummary'
import type { IDeathSummaryFromReportsRoot } from '@/types/DeathSummaryFromReports'
import EvaluationResultHelpDialog from '@/components/EvaluationResultHelpDialog.vue'
import CustomHeader1 from '@/components/CustomHeader1.vue'
import CustomHeader2 from '@/components/CustomHeader2.vue'
import DeathPerAgeGraph from '@/components/DeathPerAgeGraph.vue'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = '#2962ff'
AppBarUseHelpPage.value = true
AppBarHelpPageLink.value = 'how-to-use-summary-page'

const carditisSummaryData = shallowRef<ICarditisSummaryRoot>()
const deathSummaryData = shallowRef<IDeathSummaryRoot>()
const deathSummaryDataFromReports = shallowRef<IDeathSummaryFromReportsRoot>()
onMounted(() => {
  axios
    .get<ICarditisSummaryRoot>(CarditisSummaryURL)
    .then((response) => {
      carditisSummaryData.value = response.data

      carditisSummarySeries.value.push(carditisSummaryData.value.carditis_summary.myocarditis)
      carditisSummarySeries.value.push(carditisSummaryData.value.carditis_summary.pericarditis)

      for (let index = 0; index < carditisSummaryData.value.carditis_issues.issues_with_vaccine_name.length; index++) {
        const issue = carditisSummaryData.value.carditis_issues.issues_with_vaccine_name[index]

        myocarditisByVaccineLabels.value.push(issue.vaccine_name)
        myocarditisByVaccineSeries.value.push(issue.myocarditis_count)

        pericarditisByVaccineLabels.value.push(issue.vaccine_name)
        pericarditisByVaccineSeries.value.push(issue.pericarditis_count)
      }
      
      // 2つ目以降のグラフが手動リフレッシュ無しにちゃんと表示されるようにするために必要な処理
      window.dispatchEvent(new Event('resize'))
    })
    .catch((error) => console.log('failed to get carditis summary data: ' + error))
  
  axios
    .get<IDeathSummaryRoot>(DeathSummaryURL)
    .then((response) => {
      deathSummaryData.value = response.data

      deathSummaryLabels.value.push('α')
      deathSummarySeries.value.push(deathSummaryData.value.death_summary.sum_by_evaluation.alpha)
      deathSummaryLabels.value.push('β')
      deathSummarySeries.value.push(deathSummaryData.value.death_summary.sum_by_evaluation.beta)
      deathSummaryLabels.value.push('γ')
      deathSummarySeries.value.push(deathSummaryData.value.death_summary.sum_by_evaluation.gamma)

      for (let index = 0; index < deathSummaryData.value.death_summary.sum_by_vaccine_name.length; index++) {
        const element = deathSummaryData.value.death_summary.sum_by_vaccine_name[index];
        deathSummaryByVaccineLabels.value.push(element.vaccine_name)
        deathSummaryByVaccineSeries.value.push(element.evaluations.alpha + element.evaluations.gamma)
      }

      // 2つ目以降のグラフが手動リフレッシュ無しにちゃんと表示されるようにするために必要な処理
      window.dispatchEvent(new Event('resize'))
    })
    .catch((error) => console.log('failed to get death summary data: ' + error))

  axios
    .get<IDeathSummaryFromReportsRoot>(DeathSummaryFromReportsURL)
    .then((response) => {
      deathSummaryDataFromReports.value = response.data

      // 2つ目以降のグラフが手動リフレッシュ無しにちゃんと表示されるようにするために必要な処理
      window.dispatchEvent(new Event('resize'))
    })
    .catch((error) => console.log('failed to get death summary from reports data: ' + error))
})

const isPersentView = shallowRef(true)

const carditisSummarySeries = shallowRef<any[]>([])
const carditisSummaryOptions = {
  title: {
    text: '心筋炎/心膜炎の内訳',
    align: 'center',
    offsetX: 10,
    offsetY: 10,
  },
  chart: { type: 'pie' },
  legend: {
    position: 'bottom',
  },
  labels: ['心筋炎', '心膜炎'],
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

const myocarditisByVaccineLabels = shallowRef<string[]>([])
const myocarditisByVaccineSeries = shallowRef<any[]>([])
const myocarditisByVaccineOptions = {
  title: {
    text: 'ワクチン種類ごとの心筋炎件数',
    align: 'center',
    offsetX: 10,
    offsetY: 10,
  },
  chart: { type: 'pie' },
  legend: {
    position: 'bottom',
  },
  labels: myocarditisByVaccineLabels.value,
  plotOptions: {
    pie: {
      dataLabels: {
        minAngleToShowLabel: 0.1
      }, 
    }
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

const pericarditisByVaccineLabels = shallowRef<string[]>([])
const pericarditisByVaccineSeries = shallowRef<any[]>([])
const pericarditisByVaccineOptions = {
  title: {
    text: 'ワクチン種類ごとの心膜炎件数',
    align: 'center',
    offsetX: 10,
    offsetY: 10,
  },
  chart: { type: 'pie' },
  legend: {
    position: 'bottom',
  },
  labels: pericarditisByVaccineLabels.value,
  plotOptions: {
    pie: {
      dataLabels: {
        minAngleToShowLabel: 0.1
      }, 
    }
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

const deathSummaryLabels = shallowRef<string[]>([])
const deathSummarySeries = shallowRef<any[]>([])
const deathSummaryOptions = {
  title: {
    text: '専門家の因果関係評価の内訳',
    align: 'center',
    offsetX: 10,
    offsetY: 10,
  },
  chart: { type: 'pie' },
  legend: {
    position: 'bottom',
  },
  labels: deathSummaryLabels.value,
  plotOptions: {
    pie: {
      dataLabels: {
        minAngleToShowLabel: 0.1
      }, 
    }
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

const deathSummaryByVaccineLabels = shallowRef<string[]>([])
const deathSummaryByVaccineSeries = shallowRef<any[]>([])
const deathSummaryByVaccineOptions = {
  title: {
    text: 'α・γ評価のワクチン別 内訳',
    align: 'center',
    offsetX: 10,
    offsetY: 10,
  },
  chart: { type: 'pie' },
  legend: {
    position: 'bottom',
  },
  labels: deathSummaryByVaccineLabels.value,
  plotOptions: {
    pie: {
      dataLabels: {
        minAngleToShowLabel: 0.1
      }, 
    }
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
        width: 300
      }
    }
  }],
  dataLabels: {
    formatter: function (val: any, { seriesIndex, dataPointIndex, w } :any ) {
      if(isPersentView.value){
        return val.toFixed(2) + ' %'
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

const addNewLineWithBrackets = (label: string): string => {
  label = label.replace('（','(')
  label = label.replace('）',')')
  
  let split = label.split('(')
  if(split.length < 2) return label

  let joined = split[0] + '\r\n'
  for (let index = 1; index < split.length; index++) {
    joined += '(' + split[index];
  }
  return joined
}
</script>

<style scoped lang="css">
.big-bold {
  font-size: 1.4rem;
  font-weight: bolder;
}

.v-table {
  white-space: pre-line;
}

.small-cell {
  font-size: 0.9rem
}
</style>

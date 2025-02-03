<template>
    <v-col cols="12" sm="6">
      <apexchart :options="chartOptions" :series="chartSeries"></apexchart>
    </v-col>

    <v-col cols="12" sm="6">
      <v-table density="comfortable">
        <thead>
          <tr>
            <th class="text-left">請求内容</th>
            <th class="text-right">{{ judgedResult }}件数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in dataLabels" :key="item">
            <td v-if="item.split('・').length < 3"><v-chip variant="flat" size="x-large" :color="dataLabelColors[index]"><span>{{ item }}</span></v-chip></td>
            <td v-else>
              <v-chip variant="flat" size="x-large" :color="dataLabelColors[index]"><span class="small-text">{{ item.split('・').slice(0, 2).join('・') }}<br />{{ item.split('・').slice(2).join('・')  }}</span></v-chip>
            </td>
            <td class="text-right">{{ chartSeries[index].toLocaleString() }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
</template>

<script setup lang="ts">
import type { IJudgedIssueCount } from '@/types/CertifiedSummary';
import { shallowRef } from 'vue';

const props = defineProps<{
  judgedResult: string
  judgedIssueCountSeries: IJudgedIssueCount[]
  isPersentView: boolean
}>()

const sortedIssueSeries: IJudgedIssueCount[] = Object.assign([], props.judgedIssueCountSeries)
sortedIssueSeries.sort((c1,c2) => c2.count - c1.count )

const dLabels = []
const colors = []
const series = []
for (let index = 0; index < sortedIssueSeries.length; index++) {
  const issue = sortedIssueSeries[index];
  
  dLabels.push(getLabel(issue.name))
  colors.push(getColor(issue.name))
  series.push(issue.count)
}

const dataLabels = shallowRef<string[]>(dLabels)
const dataLabelColors = shallowRef<string[]>(colors)
const chartSeries = shallowRef<number[]>(series)

const chartOptions = {
  title: {
    text: props.judgedResult + 'された申請に関する請求内容の内訳',
    align: 'center',
  },
  chart: { type: 'pie' },
  legend: {
    position: 'bottom',
  },
  labels: dataLabels.value,
  colors: dataLabelColors.value,
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
      if(props.isPersentView){
        return val.toFixed(1) + ' %'
      } else {
        return w.config.series[seriesIndex].toLocaleString() + ' 件'
      }
    },
    style: {
      fontSize: '1.2rem',
      colors: dataLabelColors.value,
    },
    background: {
      enabled: true,
      foreColor: '#fff',
    }
  },
  plotOptions: {
    pie: {
      dataLabels: {
        minAngleToShowLabel: 0,
      }
    }
  }
}
</script>

<script lang="ts">
const getLabel = (name: string): string => {
  switch (name) {
    case 'medical_expenses':
      return '医療費・医療手当'
    case 'disability_pension_of_children':
      return '障害児養育年金'
    case 'disability_pension':
      return '障害年金'
    case 'death':
      return '死亡一時金・遺族年金・遺族一時金・葬祭料'
  
    default:
      return '（未知の請求内容）';
  }
}

const getColor = (name: string): string => {
  switch (name) {
    case 'medical_expenses':
      return '#3393FA'
    case 'disability_pension_of_children':
      return '#54E496'
    case 'disability_pension':
      return '#F6AD21'
    case 'death':
      return '#F23B61'
  
    default:
      return '#f0f8ff'
  }
}
</script>

<style scoped>
.small-text {
  font-size: 0.85rem;
}
</style>
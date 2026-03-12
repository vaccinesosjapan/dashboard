<template>
  <v-row class="mt-3">
    <v-col cols="12">
      <apexchart :options="each_op" :series="each_series" />
    </v-col>
  </v-row>

  <v-row class="mt-3">
    <v-col cols="12">
      <apexchart :options="cumulative_op" :series="cumulative_series" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import type { ICumulativeData } from '@/types/CumulativeData'

const props = defineProps<{
  data: ICumulativeData[]
}>()

let labels: string[] = []
let count_list: number[] = []
let cumulative_list: number[] = []

for (let index = 0; index < props.data.length; index++) {
  const element = props.data[index];
  
  labels.push(element.published_date)
  count_list.push(element.count)
  cumulative_list.push(element.cumulative_count)
}

// Seriesデータを作成
// name属性はマウスオーバー時に表示されるデータ名に反映される
const each_series = [{name: '報告件数', data: count_list}]
const cumulative_series = [{name: '累計件数', data: cumulative_list}]

// Optionsを作成
let each_op = create_base_options(labels)
each_op.yaxis.title.text = '報告件数 [件]'

let cumulative_op = create_base_options(labels)
cumulative_op.yaxis.title.text = '累計件数 [件]'
cumulative_op.yaxis.title.style.color = '#66DA26'
cumulative_op.colors = ['#66DA26']
</script>

<script lang="ts">
// グラフの見た目を設定するオプション情報を作成
const create_base_options = (labels: string[]) => {
  return {
    chart: {
      type: 'bar',
    },
    labels: labels,
    tooltip: {
      y: {
        formatter: function(value: any, { series, seriesIndex, dataPointIndex, w } :any) {
          return (value as number).toLocaleString() + ' 件'
        }
      },
    },
    // barチャートでZoom可能にするには、何故かこの設定が必要。
    // https://github.com/apexcharts/apexcharts.js/issues/1436#issuecomment-604638910
    xaxis: {
      tickPlacement: 'on'
    },
    yaxis: {
      labels: {
        formatter: function (value: any) {
          return (value as number).toLocaleString()
        }
      },
      title: {
        text: 'Base title',
        style: {
          fontSize: '1rem',
          color: '#2E93fA',
        },
      }
    },
    colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
    dataLabels: {
      enabled: false,
    }
  }
}
</script>

<style scoped>
.small-h3 {
  font-size: 0.9rem;
  font-weight: bold;
}

div.container {
  text-align: center;
}

.small-top{
  margin-top: 0rem;
}
</style>
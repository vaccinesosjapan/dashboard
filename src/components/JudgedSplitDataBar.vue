<template>
  <apexchart :options="chartOption" :series="series"></apexchart>
</template>

<script setup lang="ts">
import { CertifiedColors, SelectBarColorById } from '@/tools/BarColors';
import { type IJudgedSplitData } from '@/types/JudgedSplitData';
import { shallowRef } from 'vue';

const props = defineProps<{
  x_axis_data: string[]
  data: IJudgedSplitData
  cumulative: boolean
}>()

const chartOption = shallowRef<any>()
const graphTitle = props.cumulative ? `【${props.data.display_name}】認定比率・審査数 累計` : `【${props.data.display_name}】認定比率・審査数 審査会ごと`
const barColor = SelectBarColorById(props.data.id)
const y_axis_max = props.cumulative ? props.data.sum_y_axis_max : props.data.normal_y_axis_max
const downloadFileName = props.cumulative ? `${props.data.id}_cumulative` : props.data.id
chartOption.value = CreateCountAndRateChartOption(graphTitle, props.x_axis_data, barColor, y_axis_max, downloadFileName)
const series = shallowRef<any>()
series.value = props.cumulative ? [
	{
		name: '認定比率',
		type: 'line',
		data: props.data.certified_rate_sum
	},
	{
		name: '否認',
		type: 'bar',
		data: props.data.denied_sum_data
	},
	{
		name: '認定',
		type: 'bar',
		data: props.data.certified_sum_data
	},
] : [
	{
		name: '認定比率',
		type: 'line',
		data: props.data.certified_rate
	},
	{
		name: '否認',
		type: 'bar',
		data: props.data.denied_data
	},
	{
		name: '認定',
		type: 'bar',
		data: props.data.certified_data
	},
]
</script>

<script lang="ts">
const xAxisTitle = '審査会の開催日'

const CreateCountAndRateChartOption = (title: string, labels: string[], color: string, yMax: number, downloadFileName: string): any =>{
  return {
    chart: {
      type: 'line',
      stacked: true,
      toolbar: {
        export: {
          csv: {
            headerCategory: xAxisTitle,
            headerValue: 'value',
            categoryFormatter(x: any) {
              return new Date(x).toDateString()
            },
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
    stroke: {
      width: 5,
      //curve: 'stepline',
    },
    title: {
      text: title,
      style: {
        fontSize: '1.4rem',
        color: color,
      },
      offsetY: 20
    },
    tooltip: {
      y: {
        formatter: function(value: any, { series, seriesIndex, dataPointIndex, w } :any) {
          const numValue = value as number
          if( numValue == null ){
            // 件数がゼロの時の「認定比率」など、nullになる可能性があるため。
            return
          }

          if(w.config.series[seriesIndex].name == '認定比率'){
            return numValue.toFixed(1) + ' %'
          } else {
            return numValue.toLocaleString() + ' 件'
          }
        }
      },
    },
    xaxis: {
      categories: labels,
      type: 'category',
      title: {
        text: xAxisTitle,
        offsetY: -25,
        style: {
          fontSize: '1rem',
          colors: ['#212121'],
        },
      }
    },
    yaxis: [
      {
        seriesName: "認定比率",
        opposite: false,
        title: {
          text: "認定比率 [%]",
          style: {
            fontSize: '1rem',
            color: CertifiedColors.CertifiedRate,
          },
        },
        min: 0,
        max: 100.0,
        labels: {
          formatter: function (value: any) {
            return value.toFixed(1)
          },
          style: {
            colors: [CertifiedColors.CertifiedRate],
          }
        },
      },
      {
        seriesName: ['認定', '否認'],
        opposite: true,
        labels: {
          formatter: function (value: any) {
            return value.toLocaleString()
          },
          style: {
            colors: [CertifiedColors.Denied],
          }
        },
        max: yMax
      },
      {
        seriesName: ['認定', '否認'],
        opposite: true,
        title: {
          text: '審査数 [件]',
          style: {
            fontSize: '1rem',
            color: CertifiedColors.Certified,
          },
        },
        labels: {
          formatter: function (value: any) {
            return value.toLocaleString()
          },
          style: {
            colors: [CertifiedColors.Certified],
          }
        },
        max: yMax,
      },
    ],
    dataLabels: {
      enabled: false,
    },
    colors: [ CertifiedColors.CertifiedRate, CertifiedColors.Denied, CertifiedColors.Certified ],
    legend: {
      fontSize: '14',
      offsetX: -80,
    }
  }
}
</script>

<style scoped>
</style>
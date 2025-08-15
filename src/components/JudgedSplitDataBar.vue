<template>
  <apexchart :options="chartOption" :series="series"></apexchart>
</template>

<script setup lang="ts">
import { CertifiedColors, CertifiedColorsByClaimType } from '@/tools/BarColors';
import { type IJudgedSplitData } from '@/types/JudgedSplitData';
import { shallowRef } from 'vue';

const props = defineProps<{
  x_axis_data: string[]
  data: IJudgedSplitData
}>()

const chartOption = shallowRef<any>()
//const graphTitle = props.data.cumulative ? `累計の認定件数の推移 - ${props.data.display_name}` : `審査会ごとの認定件数の推移 - ${props.data.display_name}`
const graphTitle = `【${props.data.display_name}】認定比率・審査数 累計`
const barColor = SelectBarColor(props.data.id)
chartOption.value = CreateCountAndRateChartOption(graphTitle, props.x_axis_data, barColor, props.data.sum_y_axis_max, props.data.id)
const series = shallowRef<any>()
series.value = [
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
]
</script>

<script lang="ts">
const xAxisTitle = '審査会の開催日'

const SelectBarColor = (claimType: string): string => {
  if (claimType.startsWith('medical')) {
    return CertifiedColorsByClaimType.Medical
  } else if (claimType.startsWith('disability_of_children')) {
    return CertifiedColorsByClaimType.DisabilityOfChildren
  } else if (claimType.startsWith('disability')) {
    return CertifiedColorsByClaimType.Disability
  } else if (claimType.startsWith('death')) {
    return CertifiedColorsByClaimType.Death
  } else {
    return CertifiedColorsByClaimType.Medical
  }
}

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
          if(w.config.series[seriesIndex].name == '認定比率'){
            return (value as number).toFixed(1) + ' %'
          } else {
            return (value as number).toLocaleString() + ' 件'
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
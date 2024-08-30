import type { ShallowRef } from "vue"

export const CreatePieChartOption = (title: string, labels: ShallowRef<string[]>, isPersentView: ShallowRef<boolean>): any => {
	return {
    title: {
      text: title,
      align: 'center',
      offsetX: 10,
      offsetY: 10,
    },
    chart: { type: 'pie' },
    legend: {
      position: 'bottom',
    },
    labels: labels.value,
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
}

export const CreateBarChartOption = (title: string): any =>{
  return {
    title: {
      text: title,
      align: 'center',
      offsetX: 10,
      offsetY: 10,
    },
    chart: {
      type: 'bar',
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '0.8rem'
        },
        offsetY: 5,
        maxWidth: 250
      }
    },
    tooltip: {
      y: {
        formatter: (val: any) => {
          return (val as number).toLocaleString() + ' 件'
        },
        title: {
					formatter: (): string => {
						return '件数: '
					}
				}
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    labels: []
  }
}

const xAxisTitleOfCertifiedCountAndRateChart = '審議会の開催日'

export interface ICertifiedCountAndRateGraphInfo {
  CountTitle: string
  RateTitle: string
  RepudiationSeriesName: string
  CertifiedSeriesName: string
  RateSeriesName: string
}

export const CreateEachCertifiedCountAndRateChartOption = (title: string, info: ICertifiedCountAndRateGraphInfo, labels: string[], countMax: number): any =>{
  return {
    chart: {
      type: 'line',
      stacked: true,
      toolbar: {
        export: {
          csv: {
            headerCategory: xAxisTitleOfCertifiedCountAndRateChart,
            headerValue: 'value',
            categoryFormatter(x: any) {
              return new Date(x).toDateString()
            }
          }
        }
      }
    },
    stroke: {
      width: 5
    },
    title: {
      text: title,
      style: {
        fontSize: '1.2rem',
        colors: ['#212121'],
      },
      offsetY: 20
    },
    tooltip: {
    y: {
        formatter: function(value: any, { series, seriesIndex, dataPointIndex, w } :any) {
          if(w.config.series[seriesIndex].name == info.RateSeriesName){
            return (value as number).toFixed(1) + ' %'
          } else {
            return (value as number).toLocaleString() + ' 件'
          }
        }
      },
    },
    labels: labels,
    xaxis: {
      title: {
        text: xAxisTitleOfCertifiedCountAndRateChart,
        offsetY: -25,
        style: {
          fontSize: '1rem',
          colors: ['#212121'],
        },
      }
    },
    yaxis: [
      {
        seriesName: [info.RepudiationSeriesName, info.CertifiedSeriesName],
        labels: {
          formatter: function (value: any) {
            return value.toLocaleString()
          },
          style: {
            colors: ['#E83938'],
          }
        },
        max: countMax
      },
      {
        seriesName: [info.RepudiationSeriesName, info.CertifiedSeriesName],
        title: {
          text: info.CountTitle,
          style: {
            fontSize: '1rem',
            color: '#6CAF52',
          },
        },
        labels: {
          formatter: function (value: any) {
            return value.toLocaleString()
          },
          style: {
            colors: ['#6CAF52'],
          }
        },
        max: countMax,
      },
      {
        seriesName: info.RateSeriesName,
        opposite: true,
        title: {
          text: info.RateTitle,
          style: {
            fontSize: '1rem',
            color: '#7560CF',
          },
        },
        max: 100.0,
        labels: {
          formatter: function (value: any) {
            return value.toFixed(1)
          },
          style: {
            colors: ['#7560CF'],
          }
        },
      }
    ],
    colors: ['#E83938', '#6CAF52', '#7560CF'],
    legend: {
      fontSize: '14rem',
    }
  }
}

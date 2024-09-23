import type { ICertifiedSummaryWithOtherVaccines } from "@/types/CertifiedSummary"

// apexchartsに渡す際のSeriesデータ型
export interface StackedBarSeries {
	name: string
	data: number[]
}

// datasetから取得した「過去の各種ワクチン」と「新型コロナワクチン」の認定件数まとめデータから
// apexchartsに渡す各種データを抽出する関数。
export const ExtractSomeCertifiedSummaryArray = (summayData: ICertifiedSummaryWithOtherVaccines):
 [string[], StackedBarSeries[], string[], number[], number[], number[], number[]] => {
	const categories: string[] = []

	const medicalValues: number[] = []
	const disabilityOfChildrenValues: number[] = []
	const disabilityValues: number[] = []
	const deathValues: number[] = []

	for (let index = 0; index < summayData.chart_data.data.length; index++) {
		const chartData = summayData.chart_data.data[index]
		categories.push(chartData.vaccine_name)

		medicalValues.push(chartData.medical)
		disabilityOfChildrenValues.push(chartData.disability_of_children)
		disabilityValues.push(chartData.disability)
		deathValues.push(chartData.death)
	}
	
	const header1 = summayData.chart_data.headers[1];
	const header2 = summayData.chart_data.headers[2];
	const header3 = summayData.chart_data.headers[3];
	const header4 = summayData.chart_data.headers[4];
	const headerNames = [header1, header2, header3, header4]

	const allSeries: StackedBarSeries[] = []
	allSeries.push({ name: header1, data: medicalValues })
	allSeries.push({ name: header2, data: disabilityOfChildrenValues })
	allSeries.push({ name: header3, data: disabilityValues })
	allSeries.push({ name: header4, data: deathValues })

	return [categories, allSeries, headerNames, medicalValues, disabilityOfChildrenValues, disabilityValues, deathValues]
}

const downloadFileName = 'certified-summary-with-other-vaccines'

const numberFormatter = (value: any) => { return value.toLocaleString() }
const issueFormatter = (value: any) => { return value.toLocaleString() + ' 件' }
const createBaseChartOption = (): any => {
		return {
			title: {
			text: [''],
			align: 'center',
			offsetY: 10,
		},
		chart: {
			type: 'bar',
			stacked: false,
			toolbar:{
				export: {
					csv: {
						headerCategory: 'ワクチン名',
						filename: downloadFileName,
					},
					svg: {
						filename: downloadFileName,
					},
					png: {
						filename: downloadFileName,
					}
				},
			}
		},
		legend: {
			show: false
		},
		tooltip: {
			y: {
				formatter: issueFormatter
			},
		},
		responsive: [{
			breakpoint: 800,
			options: {
				chart: {
					height: 800
				}
			}
		}],
		plotOptions: {
			bar: {
				horizontal: true,
			},
		},
		xaxis: {
			categories: [''],
			labels: {
				formatter: numberFormatter
			},
		},
		stroke: {
			width: 1,
			colors: ['#fff']
		},
		dataLabels: {
			formatter: issueFormatter
		}
	}
}

export const CreateAllCertifiedChartOption = (title: string[], categories: string[], isStacked: boolean): any => {
	const chartOption = createBaseChartOption()

	chartOption.title.text = title
	chartOption.xaxis.categories = categories
	chartOption.chart.stacked = isStacked

	return chartOption
}

export const CreateEachBillingDetailsChartOption = (title: string[], barColor: string, categories: string[], isStacked: boolean): any => {
	const chartOption = createBaseChartOption()

	chartOption.title.text = title
	chartOption.colors = [barColor]
	chartOption.xaxis.tickAmount = 3
	chartOption.xaxis.categories = categories
	chartOption.chart.stacked = isStacked

	chartOption.dataLabels.style = {
		fontSize: '0.7rem',
		colors: ['#818181'],
	}
	chartOption.dataLabels.background = {
		enabled: true,
		foreColor: '#fff',
	}
	chartOption.dataLabels.offsetX = 35
	chartOption.dataLabels.offsetY = 6

	return chartOption
}
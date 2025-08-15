// 審査会のデータを請求内容ごとに集計したデータ。
// 審査会の日付データ（x_axis_data）は全てのデータで共通のため、1つだけ保持する。
export interface IJudgedSplitDataList {
	x_axis_data: string[]
	data_list: IJudgedSplitData[]
}

export interface IJudgedSplitData {
	id: string
	display_name: string
	certified_data: number[]
	certified_sum_data: number[]
	denied_data: number[]
	denied_sum_data: number[]
	certified_rate: number[]
	certified_rate_sum: number[]
	normal_y_axis_max: number
	sum_y_axis_max: number
}

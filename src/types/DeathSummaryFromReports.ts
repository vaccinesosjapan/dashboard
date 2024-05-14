import type { ILotNumberInformation } from "./LotNumberInfomation"

export interface IDeathSummaryFromReportsRoot {
	death_summary_from_reports: IDeathSummaryFromReports
}

export interface IDeathSummaryFromReports {
	date: string
	sum_by_age: I2DItem[]
	lot_no_info: ILotNumberInformation
}

export interface I2DItem {
	x: string
	y: number
}
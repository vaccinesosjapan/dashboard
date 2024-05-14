import type { ILotNumberInformation } from "./LotNumberInfomation"

export interface ICarditisSummaryFromReportsRoot {
	carditis_summary_from_reports: ICarditisSummaryFromReports
}

export interface ICarditisSummaryFromReports {
	lot_no_info: ILotNumberInformation
}
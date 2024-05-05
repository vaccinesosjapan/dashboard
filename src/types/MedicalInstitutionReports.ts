import type { ISourceInfo } from "./General"

export interface IMedicalInstitutionReport {
	no: number
	age: number
	gender: string
	vaccinated_dates: string[]
	onset_dates: string[]
	days_to_onset: number[]
	vaccine_name: string
	manufacturer: string
	lot_no: string
	PT_names: string[]
	causal_relationship: string
	severity: string
	gross_result_dates: string
	gross_results: string[]
	source: ISourceInfo
}

export interface IMedicalInstitutionSummary {
	medical_institution_summary_from_reports: IMedicalInstitutionSummaryFromReports
}

export interface IMedicalInstitutionSummaryFromReports {
	date: string
	total_count: string
	sum_causal_relationship: [string, number][]
	sum_severities_of_related: [string, number][]
	lot_no_info: ILotNumberInformation
}

export interface ILotNumberInformation {
	top_ten_list: ILotNumberItem[]
	invalid_count: number
}

export interface ILotNumberItem {
	lot_no: string
	count: number
	manufacturer: string
}
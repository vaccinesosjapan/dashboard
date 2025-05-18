import type { ISourceInfo } from "./General"
import type { ILotNumberInformation } from "./LotNumberInfomation"

export interface IMedicalInstitutionReport {
	id: string
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
	concurrent_vaccination_flag: boolean
	concurrent_vaccination: string
	pre_existing_disease_names: string
	pt_by_expert: string
	causal_relationship_by_expert: string
	brighton_classification_by_expert: string
	comments_by_expert: string
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

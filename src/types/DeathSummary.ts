import type { ISourceInfo } from "./General"

export interface IDeathSummaryRoot {
	death_summary: IDeathSummary
	death_issues: IDeathIssues 
}

export interface IDeathSummary {
	date: string
	source: ISourceInfo
	sum_by_evaluation: ISumByEvaluation
	sum_by_vaccine_name: ISumByVaccineName[]
	sum_by_manufacturer: ISumByManufacturer[]
}

export interface ISumByEvaluation {
	total: number
	alpha: number
	beta: number
	gamma: number
}

export interface ISumByVaccineName {
	vaccine_name: string
	evaluations: IEvaluations
}

export interface IEvaluations {
	alpha: number
	beta: number
	gamma: number
}

export interface ISumByManufacturer {
	manufacturer: string
	death_count: number
}

export interface IDeathIssues {
	date: string
}
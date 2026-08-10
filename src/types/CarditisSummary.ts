import type { ISourceInfo } from "./General"

export interface ICarditisSummaryRoot {
	carditis_summary: ICarditisSummary
	carditis_issues: {
		date: string
		issues_by_evaluated_result: ICarditisIssueByEvaluatedResult
		issues_m_by_manufacturers: ICarditisIssueWithManufacturer[]
		issues_p_by_manufacturers: ICarditisIssueWithManufacturer[]
		issues_by_ages: {
			ages_count: number
			unknown_ages_count: number
			issues: {x:string, y:number}[]
		}
	}
}

export interface ICarditisIssueByEvaluatedResult {
	myocarditis: IEvaluationResultSet
	pericarditis: IEvaluationResultSet
}

export interface IEvaluationResultSet {
	alpha: number
	beta: number
	gamma: number
}

export interface ICarditisSummary {
	date: string
	total: number
	myocarditis: number
	pericarditis: number
	source: ISourceInfo
}

export interface ICarditisIssueWithManufacturer {
	manufacturer: string
	count: number
}

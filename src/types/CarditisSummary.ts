import type { ISourceInfo } from "./General"

export interface ICarditisSummaryRoot {
	carditis_summary: ICarditisSummary
	carditis_issues: {
		date: string
		issues_with_vaccine_name: ICarditisIssueWithVaccineName[]
		issues_by_manufacturers: ICarditisIssueWithManufacturer[]
		issues_by_ages: {
			ages_count: number
			unknown_ages_count: number
			issues: {x:string, y:number}[]
		}
	}
}

export interface ICarditisSummary {
	date: string
	total: number
	myocarditis: number
	pericarditis: number
	source: ISourceInfo
}

export interface ICarditisIssueWithVaccineName {
	vaccine_name: string
	myocarditis_count: number
	pericarditis_count: number
}

export interface ICarditisIssueWithManufacturer {
	manufacturer: string
	myocarditis_count: number
	pericarditis_count: number
}

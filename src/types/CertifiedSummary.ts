export interface ICertifiedSummary {
	date: string
	total_entries: number
	certified_count: number
	denied_count: number
	pending_count: number
	open_cases_count: number
	certified_death_count: number
	denied_death_count: number
}

export interface ICertifiedSummaryWithOtherVaccines {
	meta_data: {
		covid19_vaccine: IMetaData
		other_vaccines: IMetaData
	}
	chart_data: {
		headers: string[]
		data: IChartData[]
	}
}

export interface IMetaData {
	first_date: string
	last_date: string
	period: string
	certified_count: number
	source_url: string
}

export interface IChartData {
	vaccine_name: string
	medical: number
	disability_of_children: number
	disability: number
	death: number
}
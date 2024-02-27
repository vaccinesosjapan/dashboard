export interface ICertifiedTrends {
	female_counts: ITrend[]
	male_counts: ITrend[]
	sum_counts: ITrend[] 
}

export interface ITrend {
	name: string
	count: number
}
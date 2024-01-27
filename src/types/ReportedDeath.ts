export interface IReportedDeathIssues {
  issues: IReportedDeathIssue[]
}

export interface IReportedDeathIssue {
  no: number
  manufacturer: string
  vaccine_name: string
  age: number
  gender: string
  vaccinated_dates: string
  onset_dates: string
  lot_no: string
  vaccinated_times: string
  pre_existing_conditions: string
  PT_names: string[]
  tests_used_for_determination: string
  causal_relationship: string
  causal_relationship_by_expert: string
  comments_by_expert: string
  id: string
}

import { shallowRef } from 'vue'

export const AppBarTitle = shallowRef('副反応ダッシュボード')
export const AppBarColor = shallowRef('white')
export const AppBarUseHelpPage = shallowRef(false)
export const AppBarHelpPageLink = shallowRef('')

// production
const DatasetsURL = import.meta.env.VITE_DATASETS_URL
// for debug
//const DatasetsURL = '/_datasets/'

export const MedicalInstitutionReportsURL = DatasetsURL + 'medical-institution-reports.json'
export const MedicalInstitutionMetadataURL = DatasetsURL + 'medical-institution-metadata.json'
export const MedicalInstitutionSummaryURL = DatasetsURL + 'medical-institution-summary-from-reports.json'

export const CarditisReportsURL = DatasetsURL + 'carditis-reports.json'
export const CarditisMetadataURL = DatasetsURL + 'carditis-metadata.json'
export const CarditisSummaryURL = DatasetsURL + 'carditis-summary.json'
export const CarditisSummaryFromReportsURL = DatasetsURL + 'carditis-summary-from-reports.json'

export const DeathReportsURL = DatasetsURL + 'death-reports.json'
export const DeathMetadataURL = DatasetsURL + 'death-metadata.json'
export const DeathSummaryURL = DatasetsURL + 'death-summary.json'
export const DeathSummaryFromReportsURL = DatasetsURL + 'death-summary-from-reports.json'

export const CertifiedSummaryURL = DatasetsURL + 'certified-summary.json'
export const CertifiedSummaryWithOtherVaccinesURL = DatasetsURL + 'certified-summary-with-other-vaccines.json'
export const CertifiedTrendsURL = DatasetsURL + 'certified-trends.json'

export const CertifiedHealthHazardDataURL = DatasetsURL + 'certified-reports.json'
export const CertifiedMetadataURL = DatasetsURL + 'certified-metadata.json'

export const CertifiedSymptomsDataURL = DatasetsURL + 'certified-symptoms.json'
export const CertifiedSymptomsMetadataURL = DatasetsURL + 'certified-symptoms-metadata.json'

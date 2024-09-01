// 審査結果の毎回の件数や累計の件数、認定の割合などのデータ
export interface IJudgedData {
	Date: string
    CertifiedCount: number
    RepudiationCount: number,
    CertifiedRate: number,
    CertifiedCountSum: number,
    RepudiationCountSum: number,
    CertifiedRateSum: number
}

// 審査結果の件数や認定割合をグラフ化する時の情報（Y軸タイトルなど）
export interface IJudgedDataGraphInfo {
  GraphTitle: string
  CountTitle: string
  RateTitle: string
  RepudiationSeriesName: string
  CertifiedSeriesName: string
  RateSeriesName: string
  CountYAxisMax: number
}
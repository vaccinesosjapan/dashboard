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
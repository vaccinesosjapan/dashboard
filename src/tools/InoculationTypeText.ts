// 審査会の接種タイプを示す数字を引数に渡すことで、対応する表示文字列を返す。
export const InoculationTypeText = (inoculationType: number): string => {
	let text = ""
	switch (inoculationType) {
		case 0:
			text = "特例臨時接種"
			break

		case 1:
			// 「第193回 疾病・障害認定審査会感染症・予防接種審査分科会」から登場したデータ。
			// 「定期接種」として申請された案件とのことで、PCGなど従来からある他のワクチ被害と同じ表に分類されているデータ。
			text = "定期接種(B類)"
			break

		default:
			// 未対応の番号は無難に空文字
			text = ""
			break
	}

	return text
}
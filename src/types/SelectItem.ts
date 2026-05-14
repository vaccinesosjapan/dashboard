// 値は数値で、表示用の文字列を別に持つタイプの選択肢
export class SelectItem {
	value: number
	display_name: string

	constructor(value: number, display_name: string) {
		this.value = value
		this.display_name = display_name
	}
}
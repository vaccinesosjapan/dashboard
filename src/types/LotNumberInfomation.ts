export interface ILotNumberInformation {
	top_ten_list: ILotNumberItem[]
	invalid_count: number
}

export interface ILotNumberItem {
	lot_no: string
	count: number
	manufacturer: string
}
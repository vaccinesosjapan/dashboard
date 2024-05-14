export interface ILotNumberInformation {
	top_ten_list: ILotNumberItem[]
	top_ten_list_moderna: ILotNumberItem[]
	invalid_count: number
}

export interface ILotNumberItem {
	lot_no: string
	count: number
	manufacturer: string
}
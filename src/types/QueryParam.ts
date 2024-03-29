import type { ShallowRef } from "vue"
import router from '@/router/index'

export interface IQueryParam {
	name: string
	val: ShallowRef<any>
}

export interface IQueryParamWithArray {
	name: string
	val: ShallowRef<any>
	isArray: boolean
}

export const CreateUrlWithQueryParams = (queryParamMap: IQueryParam[] | IQueryParamWithArray[]): string => {
	let retUrl = window.location.origin + import.meta.env.BASE_URL + '#' + router.currentRoute.value.path + '?'
	let isFirstQuery = true
	queryParamMap.forEach(item => {
		if(isNotNullEmpty(item.val)) {
			if(isFirstQuery){
				retUrl = retUrl + item.name + '=' + encodeURI(item.val.value)
				isFirstQuery = false
			} else {
				retUrl = retUrl + '&' + item.name + '=' + encodeURI(item.val.value)
			}
		}
	})

	return retUrl
}

const isNotNullEmpty = (val: ShallowRef<string>): boolean => {
  return val.value != '' && val.value != null
}
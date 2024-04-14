import type { ShallowRef } from "vue"
import router from '@/router/index'
import type { LocationQuery } from "vue-router"

export interface IQueryParam {
	name: string
	val: ShallowRef<any>
}

export const CreateUrlWithQueryParams = (queryParamMap: IQueryParam[]): string => {
	let retUrl = window.location.origin + import.meta.env.BASE_URL + '#' + router.currentRoute.value.path + '?'
	let isFirstQuery = true
	queryParamMap.forEach(item => {
		if(isNotNullOrEmpty(item.val.value)) {
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

// Parseしたパラメータがあれば、「検索条件の変更あり」としてtrueを返す。
// なければfalseを返す。
export const ParseQueryParams = (queryParamMap: IQueryParam[], pageQueryParams: LocationQuery ): boolean => {
	let isSearchConditionChanged = false

	queryParamMap.forEach(item => {
	const param = pageQueryParams[item.name]
		if(param != undefined) {
			if(Array.isArray(item.val.value)){
			const paramArray = param.toString().split(',')
			for (let index = 0; index < paramArray.length; index++) {
				item.val.value.push(paramArray[index])
			}
			} else {
			item.val.value = param.toString()
			}
			isSearchConditionChanged = true
		}
	})

	return isSearchConditionChanged
}

// 検索条件をクリアする処理。
// 複数選択可能なSelect要素のようにユーザー入力が配列になる場合もあり、確認しつつ空にしてゆく。
//
// [Note]
//  - 引数でもらったクエリパラメータたちを初期化する（書き換える）
//  - 引数でもらった「検索条件の変更有無」もfalseにして、変更無しの状態にする（書き換える）
export const ClearFilterValues = (queryParamMap: IQueryParam[], searchConditionChanged: ShallowRef<boolean>) => {
	for (let index = 0; index < Object.values(queryParamMap).length; index++) {
    const element = Object.values(queryParamMap)[index];
    if(Array.isArray(element.val.value)){
      element.val.value = []
    } else {
      element.val.value = ''
    }
  }
  searchConditionChanged.value = false
}

// クエリパラメータの一覧をもらい、空文字やnull以外の値が入ったものがあれば
// 「検索条件の変更あり」という意味でtrueを返す。
export const IsConditionChanged = (queryParamMap: IQueryParam[]): boolean => {
  const ret = queryParamMap.find(item =>{
    if(Array.isArray(item.val.value)){
      return item.val.value.find(x=>isNotNullOrEmpty(x))
    } else {
      return isNotNullOrEmpty(item.val.value)
    }
  })
  return ret != undefined ? true : false
}

const isNotNullOrEmpty = (val: string): boolean => {
  return val != undefined && val != null && val != ''
}
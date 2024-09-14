<template>
      <flat-pickr v-model="dateModel" placeholder="日付を選択.." :config="dateTimePickerConfig"></flat-pickr>
</template>

<script setup lang="ts">
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/themes/material_green.css'
import { Japanese as JapaneseLocale} from 'flatpickr/dist/l10n/ja.js'
import YearSelectPlugin from '@/plugins/YearSelectPlugin';

defineProps<{
}>()

const dateModel = defineModel<string>('date', { default: '' })

// special thanks: http://cmz.wp.xdomain.jp/archives/1070
const onDayCreate = ( dObj: any, dStr: any, fp: any, dayElem: any ) => {
  var dayOfWeek = dayElem.dateObj.getDay();
  switch( dayOfWeek ){
    case 0: dayElem.classList.add('sunday'); break;
    case 6: dayElem.classList.add('saturday'); break;
  }
}

const dateTimePickerConfig :any = {
	locale: JapaneseLocale,
	altInput: true,
	altFormat: "Y年m月d日",
	dateFormat : 'Y-m-d',
	disableMobile: true,
	onDayCreate: onDayCreate,
	plugins: [YearSelectPlugin({startYear: 2021, endYear: new Date().getFullYear(), yearUnit: '年', yearFirst: true})]
}
</script>

<style>
/* Copy from bootstrap */
.form-control.input {
    display: block;
    height: calc(1.5em + .75rem + 2px);
    width: 160px;
    padding: .375rem .75rem;
    font-size: 0.9rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: .25rem;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out
}
.flatpickr-day.saturday:not(.selected) {
	color: rgb(0, 0, 255);
}
.flatpickr-day.sunday:not(.selected) {
	color: rgb(255, 0, 0);
}
</style>

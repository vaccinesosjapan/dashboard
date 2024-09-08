<template>
  <v-sheet class="d-flex flex-wrap">
    <h7 class="mt-2 text-h7">{{ title }}</h7>
    <v-btn v-if="(startDateModel != '' && startDateModel != undefined) || (endDateModel != '' && endDateModel != undefined)"
     class="ml-auto mt-2 small-text" prepend-icon="mdi-backspace-outline"
     :onclick="onClear" size="small" density="comfortable" variant="elevated" color="lime-lighten-1" text="入力した日付を消去"></v-btn>
  </v-sheet>
  
  <v-sheet class="d-flex flex-wrap">
    <v-sheet name="pickr" class="d-flex flex-wrap mt-2">
      <flat-pickr class="pickr-control" v-model="startDateModel" placeholder="日付を選択.." :config="dateTimePickerConfig"></flat-pickr>
    </v-sheet>

    <v-label class="ml-1 mr-2 mt-2 text-body-2">から</v-label>

    <v-sheet name="pickr" class="d-flex flex-wrap mt-2">
      <flat-pickr class="pickr-control" v-model="endDateModel" placeholder="日付を選択.." :config="dateTimePickerConfig"></flat-pickr>
    </v-sheet>

    <v-label class="ms-1 mt-2 text-body-2">までの期間を表示</v-label>
  </v-sheet>
</template>

<script setup lang="ts">
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/themes/material_green.css'
import { Japanese as JapaneseLocale} from 'flatpickr/dist/l10n/ja.js'

defineProps<{
  title: string
}>()

const startDateModel = defineModel<string>('start', { default: '' })
const endDateModel = defineModel<string>('end', { default: '' })

// special thanks: http://cmz.wp.xdomain.jp/archives/1070
const onDayCreate = ( dObj: any, dStr: any, fp: any, dayElem: any ) => {
  var dayOfWeek = dayElem.dateObj.getDay();
  switch( dayOfWeek ){
    case 0: dayElem.classList.add('sunday'); break;
    case 6: dayElem.classList.add('saturday'); break;
  }
}
/*const onChange = (selectedDates: any, dateStr: string, instance: any) => {
  console.log(dateStr)
}*/

const dateTimePickerConfig = {
	locale: JapaneseLocale,
  altInput: true,
  altFormat: "Y年m月d日",
	dateFormat : 'Y-m-d',
  disableMobile: true,
	onDayCreate: onDayCreate,
  //onChange: onChange
}

const onClear = (event: Event) => {
  const parentOfPickrElem = (event.target as HTMLButtonElement).parentElement?.parentElement?.nextElementSibling
  if(!parentOfPickrElem?.hasChildNodes) return
  for (const childNode of parentOfPickrElem.children) {
    if(childNode.getAttribute('name') == 'pickr'){
      (childNode.firstChild as any)._flatpickr.clear()
    } 
  }
}
</script>

<style scoped>
.small-text {
  font-size: 0.7rem;
}
</style>

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

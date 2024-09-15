<template>
  <v-sheet class="d-flex flex-wrap">
    <h6 class="mt-2 text-subtitle-1">{{ title }}</h6>
    <v-btn v-if="(startDateModel != '' && startDateModel != undefined) || (endDateModel != '' && endDateModel != undefined)"
     class="ml-auto mt-2 small-text" prepend-icon="mdi-backspace-outline"
     :onclick="onClear" size="small" density="comfortable" variant="elevated" color="lime-lighten-1" text="入力した日付を消去"></v-btn>
  </v-sheet>
  
  <v-sheet class="d-flex flex-wrap">
    <v-sheet name="pickr" class="d-flex flex-wrap mt-2">
      <FlatPickrWrapper v-model:date="startDateModel" ></FlatPickrWrapper>
    </v-sheet>

    <v-label class="ml-1 mr-2 mt-2 text-body-2">から</v-label>

    <v-sheet name="pickr" class="d-flex flex-wrap mt-2">
      <FlatPickrWrapper v-model:date="endDateModel" ></FlatPickrWrapper>
    </v-sheet>

    <v-label class="ms-1 mt-2 text-body-2">までの期間を表示</v-label>
  </v-sheet>
</template>

<script setup lang="ts">
import FlatPickrWrapper from '@/components/FlatPickrWrapper.vue'

defineProps<{
  title: string
}>()

const startDateModel = defineModel<string>('start', { default: '' })
const endDateModel = defineModel<string>('end', { default: '' })

const onClear = () => {
  startDateModel.value = ''
  endDateModel.value = ''
}
</script>

<style scoped>
.small-text {
  font-size: 0.7rem;
}
</style>

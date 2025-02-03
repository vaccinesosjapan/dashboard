<template>
    <v-icon class="d-block d-sm-none d-md-none" icon="mdi-alert-decagram-outline" :size="sizeArray[0]" color="warning"></v-icon>
    <v-icon class="d-none d-sm-block d-md-none" icon="mdi-alert-decagram-outline" :size="sizeArray[1]" color="warning"></v-icon>
    <v-icon class="d-none d-sm-none d-md-block" icon="mdi-alert-decagram-outline" :size="sizeArray[2]" color="warning"></v-icon>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';

const props = defineProps<{
  size: string
}>()

const sizeArray = shallowRef<number[]>([35, 50, 65])
if (props.size.toLowerCase() == 'large'){
    sizeArray.value = [45, 60, 75]
}
</script>
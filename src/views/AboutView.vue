<script setup lang="ts">
import { AppBarTitle, AppBarColor } from '@/router/data'
import router from '@/router/index'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = 'blue-grey-lighten-4'
</script>

<template>
  <v-container>
    <v-sheet>
      <h2 class="text-h4">本サイトについて</h2>
      <p class="text-body-1">
        厚生労働省のサイトには、新型コロナワクチンの「<a href="https://www.mhlw.go.jp/stf/shingi/shingi-kousei_284075.html">副反応疑い報告</a>」や「<a href="https://www.mhlw.go.jp/stf/shingi/shingi-shippei_127696_00001.html">予防接種健康被害</a>」に関する情報が
        PDF形式で多数掲載されています。それらのデータを見やすく整理して検索可能にし、より多くの人にとって
        見やすく、知見を得やすい情報源にするためのサイトです。
      </p>
      <br>

      <h3 class="text-h5">データについて</h3>
      <p class="text-body-1">
        「厚生科学審議会予防接種・ワクチン分科会副反応検討部会」のPDF資料から抽出したデータを使っています。
        できるだけ正確に情報を抽出するよう努めておりますが、当方はデータの正確さについて一切の責任を負いません。
      </p>
    </v-sheet>
  </v-container>
</template>

<style scoped></style>

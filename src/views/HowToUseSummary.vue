<template>
  <v-container>

    <v-card title="目次" valiant="outlined" color="indigo-darken-3">
      <v-list density="compact" nav>
        <v-list-item class="pl-6" v-for="item in howToUseSummaryPageChapter3List" :key="item.id" @click="scrollView(item.id, item.position)">
          <v-icon icon="mdi-square-medium"></v-icon> {{ item.title }}
        </v-list-item>
      </v-list>
    </v-card>

    <v-sheet>
      <h3 :id="sectionSelectPercentOrCount.id" class="text-h5 mt-10 mb-2">{{ sectionSelectPercentOrCount.title }}
        <CopyLinkSnackBar :id="sectionSelectPercentOrCount.id" :position="sectionSelectPercentOrCount.position"></CopyLinkSnackBar>
      </h3>
      <p class="text-body-1">
        「件数を表示」ボタンを押すことで、グラフに表示される数値を全体に対する割合から総件数へと切り替え可能です。
        <v-img src="images/how-to-use/select-count-view-mode.png"></v-img><br>
        逆に「割合を表示」ボタンを押すことで、グラフに表示される数値を総件数から全体に対する割合へと切り替え可能です。
        <v-img src="images/how-to-use/select-percent-view-mode.png"></v-img><br>
      </p>
    </v-sheet>

    <v-sheet>
      <h3 :id="sectionSaveGraph.id" class="text-h5 mt-10 mb-2">{{ sectionSaveGraph.title }}
        <CopyLinkSnackBar :id="sectionSaveGraph.id" :position="sectionSaveGraph.position"></CopyLinkSnackBar>
      </h3>
      <p class="text-body-1">
        グラフ右上の<v-icon icon="mdi-menu"></v-icon>アイコンをクリック（タップ）すると、グラフを保存するためのメニューが表示されます。
        <v-img src="images/how-to-use/show-graph-menu.png"></v-img><br>
        メニューの選択肢でダウンロードできるファイルは以下の通りです。
        <v-list density="compact">
          <v-list-item class="pl-6"><v-icon icon="mdi-square-medium"></v-icon>Download SVG: グラフをSVG形式の画像としてダウンロードします。</v-list-item>
          <v-list-item class="pl-6"><v-icon icon="mdi-square-medium"></v-icon>Download PNG: グラフをPNG形式の画像としてダウンロードします。</v-list-item>
          <v-list-item class="pl-6"><v-icon icon="mdi-square-medium"></v-icon>Download CSV: グラフをCSV形式のテキストとしてダウンロードします。</v-list-item>
        </v-list>
        <v-alert class="mt-2" density="compact" title="CSVファイルとは" type="info" elevation="2" border="start" border-color="blue-darken-4">
          CSVファイルは、表形式のデータをカンマ「,」で区切ったテキストデータを保存したファイルです。
          Excelで開いてご自身で集計したり、グラフ作成を行う際に利用することができます。
        </v-alert>
      </p>
    </v-sheet>

  </v-container>
</template>

<script setup lang="ts">
import { AppBarTitle, AppBarColor } from '@/router/data'
import router from '@/router/index'
import CopyLinkSnackBar from '@/components/CopyLinkSnackBar.vue'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = 'blue-grey-lighten-4'

const sectionSelectPercentOrCount = { title: '割合表示と件数表示を切り替える', id: 'select-percent-or-count', position: 'top' }
const sectionSaveGraph = { title: 'グラフを保存する', id: 'save-graph', position: 'middle' }
const howToUseSummaryPageChapter3List = [
  sectionSelectPercentOrCount,
  sectionSaveGraph
]

const scrollView = (id: string, position: string) => {
  const chapterElement = document.getElementById(id)
  if (chapterElement != null) {
    chapterElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    router.push({ query: { anchor: id, position: position} })
  }
}
</script>

<style scoped lang="css">
h2,
h3 {
  scroll-margin-top: 5rem;
  /* whatever is a nice number that gets you past the header */
}
</style>

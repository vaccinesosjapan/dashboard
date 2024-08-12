<template>
  <v-container>

    <v-card title="目次" valiant="outlined" color="indigo-darken-3">
      <v-list density="compact" nav>
        <v-list-item class="pl-6" v-for="item in howToUseIssueListChapter3List" :key="item.id" @click="scrollView(item.id)">
          <v-icon icon="mdi-square-medium"></v-icon> {{ item.title }}
        </v-list-item>
      </v-list>
    </v-card>

    <v-sheet>
      <h3 :id="sectionSaveAsCsvFile.id" class="text-h5 mt-10 mb-2">{{ sectionSaveAsCsvFile.title }}
        <CopyLinkSnackBar :id="sectionSaveAsCsvFile.id"></CopyLinkSnackBar>
      </h3>
      <p class="text-body-1">
        「CSVダウンロード」ボタンを押すと、現在の検索結果の症例一覧をCSVファイルとしてダウンロードできます。
        <v-img src="images/how-to-search/save-as-csv-file.png"></v-img>
        <v-alert class="mt-2" density="compact" title="CSVファイルとは" type="info" elevation="2" border="start" border-color="blue-darken-4">
          CSVファイルは、表形式のデータをカンマ「,」で区切ったテキストデータを保存したファイルです。
          Excelで開いてご自身で集計したり、グラフ作成を行う際に利用することができます。
        </v-alert>
        <v-alert class="mt-2" density="compact" title="ご注意" type="warning" elevation="2" border="start" border-color="orange-darken-4"
          icon="mdi-alert-decagram-outline">
          本サイトのデータ利用について注意事項があります。詳しくは <a href="#/about">Aboutページ</a> をご確認ください。
        </v-alert>
      </p>
    </v-sheet>

  </v-container>
</template>

<script setup lang="ts">
import { AppBarTitle, AppBarColor, AppBarUseTableOfContent, AppBarTableOfContentFunc } from '@/router/data'
import router from '@/router/index'
import { shallowRef } from 'vue';
import CopyLinkSnackBar from '@/components/CopyLinkSnackBar.vue'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = 'blue-grey-lighten-4'
AppBarUseTableOfContent.value = true
AppBarTableOfContentFunc.value = () => { tocDrawer.value = !tocDrawer.value }

const tocDrawer = shallowRef<boolean>(false)

const sectionSaveAsCsvFile = { title: '検索結果をCSVファイルに保存する', id: 'save-result-as-csv-file' }
const howToUseIssueListChapter3List = [
  sectionSaveAsCsvFile,
]

const scrollView = (id: string) => {
  const chapterElement = document.getElementById(id)
  if (chapterElement != null) {
    chapterElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    router.push({ query: { anchor: id } })
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

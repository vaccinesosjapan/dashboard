<template>
  <v-container>

    <v-navigation-drawer location="right" temporary width="15rem" v-model="tocDrawer">
      <v-list density="compact" nav>
        <v-list-item @click="scrollView(howToUseSummaryPageChapter2.id)">{{ howToUseSummaryPageChapter2.title }}</v-list-item>
        <v-list-item class="pl-6" v-for="item in howToUseSummaryPageChapter3List" :key="item.id" :title="item.title"
          @click="scrollView(item.id)"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-sheet>
      <h2 class="text-h4 mb-2" :id="howToUseSummaryPageChapter2.id">{{ howToUseSummaryPageChapter2.title }}
        <CopyLinkSnackBar :id="howToUseSummaryPageChapter2.id"></CopyLinkSnackBar>
      </h2>
      <p class="text-body-1">
        判定結果などの情報を集計したサマリ情報をグラフなどで表示しているサマリページの使い方を説明します。
      </p>
    </v-sheet>

    <v-sheet v-for="item in howToUseSummaryPageChapter3List" :key="item.id">
      <h3 :id="item.id" class="text-h5 mt-8 mb-2">{{ item.title }}
        <CopyLinkSnackBar :id="item.id"></CopyLinkSnackBar>
      </h3>

      <p v-if="item.id == 'confirm-issue-counts'" class="text-body-1">
        グラフにマウスを重ねたりタップして選択すると、下図のように件数が表示されます。
        <v-img max-width="400" src="images/show-issue-count-by-mouse-over.png"></v-img><br>
        また、「件数を表示」ボタンを押すことでページ全体のグラフを件数表示に変更できます。
        逆に「割合を表示」ボタンを押すことで割合表示に戻せます。
        <v-img max-width="500" src="images/exchange-graph-display-mode.png"></v-img>
      </p>

      <p v-if="item.id == 'save-graph-data-as-csv-etc'" class="text-body-1">
        グラフの右上にあるメニュー（<v-icon icon="mdi-menu"></v-icon>アイコン）を選択すると、下図のようにメニューが表示されます。
        <v-img max-width="700" src="images/show-apecharts-menu.png"></v-img><br>
        「Download SVG」や「Download PNG」を選べばそれぞれの形式の画像として、「Download CSV」を選べばCSV形式のテキストとして、
        グラフのデータを保存できます。
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

const howToUseSummaryPageChapter2 = { title: 'サマリページの使い方', id: 'how-to-use-summary' }
const howToUseSummaryPageChapter3List = [
  { title: 'グラフの各項目で件数を確認する', id: 'confirm-issue-counts' },
  { title: 'グラフをCSVや画像で保存する', id: 'save-graph-data-as-csv-etc' }
]

const scrollView = (id: string) => {
  const chapterElement = document.getElementById(id)
  if (chapterElement != null) {
    chapterElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    router.push({ path: 'how-to-use-summary-page', query: { anchor: id } })
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

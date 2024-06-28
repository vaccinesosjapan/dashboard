<template>
  <v-container>

    <v-navigation-drawer location="right" permanent :width="200">
      <v-list density="compact" nav>
        <v-list-item v-for="item in titleAndIdPairs" :key="item.id" :title="item.title"
          @click="scrollView(item.id)"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-sheet>
      <p class="text-body-1">本サイトのコンテンツを活用いただくための、便利な使い方を説明するページです。</p>
      <h2 class="text-h4 mt-7 mb-2">共通操作</h2>
      <p class="text-body-1">どのページでも共通している操作を説明します。</p>
    </v-sheet>

    <v-sheet v-for="item in titleAndIdPairs" :key="item.id">
      <h3 :id="item.id" class="text-h5 mt-7 mb-2">{{ item.title }}
        <v-snackbar :timeout="2000" color="blue-grey-darken-3">
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-link-variant" variant="flat" @click="copyLink($event)" v-bind="props"></v-btn>
          </template>
          クリップボードにリンクURLをコピーしました!
        </v-snackbar>
      </h3>

      <p v-if="item.id == 'show-search-window'" class="text-body-1">
        たくさんの症例を接種時期や年齢などで絞り込みたい状況があるかと思います。
        そういう時は、「<v-icon class="search-icon">mdi-magnify</v-icon> 詳細検索...」と表示されている箇所を選択します。
        検索項目を選択・入力するための入力欄が表示されます。
        <v-img max-width="400" src="images/how-to-show-search-area.png"></v-img>
      </p>

      <p v-if="item.id == 'tips-to-search'" class="text-body-1">
        選択肢から選ぶタイプの検索方法を例に説明します。<br>
        選択肢から該当する項目をクリックすれば、すぐに検索結果が表示されている一覧に反映されます。
        複数の項目を選択すれば全てに該当する項目のみに絞れますし、「全て選択解除」ボタンを押すと
        選択されている全ての項目を選択解除できます。
        <v-img max-width="200" src="images/search-type-select.png"></v-img>
        なにかしら検索した状態のページは、「<v-icon class="search-icon">mdi-magnify</v-icon> 詳細検索...」部分の右端に
        <v-chip size="small" variant="elevated" color="orange-lighten-3">検索ワード入力中</v-chip>というマークが表示されます。
        <v-img max-width="800" src="images/searched-marker.png"></v-img>
      </p>
    </v-sheet>

  </v-container>
</template>

<script setup lang="ts">
import { AppBarTitle, AppBarColor } from '@/router/data'
import router from '@/router/index'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = 'blue-grey-lighten-4'

const titleAndIdPairs = [
  { title: '検索画面を開こう', id: 'show-search-window' },
  { title: '検索のコツ', id: 'tips-to-search' }
]

const scrollView = (id: string) => {
  const chapterElement = document.getElementById(id)
  if (chapterElement != null) {
    chapterElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    router.push({ path: 'how-to-use', query: { anchor: id } })
  }
}

const copyLink = (event: any) => {
  let linkUrl = window.location.origin + import.meta.env.BASE_URL + '#' + router.currentRoute.value.path + '?anchor=' + event.currentTarget.parentElement.id
  if (navigator.clipboard) {
    navigator.clipboard.writeText(linkUrl);
  }
}
</script>

<style scoped lang="css">
h3 {
  scroll-margin-top: 5rem;
  /* whatever is a nice number that gets you past the header */
}
</style>

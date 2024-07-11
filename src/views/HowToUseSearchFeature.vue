<template>
  <v-container>

    <v-navigation-drawer location="right" temporary width="15rem" v-model="tocDrawer">
      <v-list density="compact" nav>
        <v-list-item @click="scrollView(howToSearchChapter2.id)">{{ howToSearchChapter2.title }}</v-list-item>
        <v-list-item class="pl-6" v-for="item in howToSearchChapter3List" :key="item.id" :title="item.title"
          @click="scrollView(item.id)"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-sheet>
      <h2 class="text-h4 mb-2" :id="howToSearchChapter2.id">{{ howToSearchChapter2.title }}
        <CopyLinkSnackBar :id="howToSearchChapter2.id"></CopyLinkSnackBar>
      </h2>
      <p class="text-body-1">
        判定結果や症例など、多数のデータが一覧表示されているページでの検索機能の使い方を解説します。
      </p>
    </v-sheet>

    <v-sheet v-for="item in howToSearchChapter3List" :key="item.id">
      <h3 :id="item.id" class="text-h5 mt-10 mb-2">{{ item.title }}
        <CopyLinkSnackBar :id="item.id"></CopyLinkSnackBar>
      </h3>

      <p v-if="item.id == 'show-search-window'" class="text-body-1">
        たくさんの症例を接種時期や年齢などで絞り込みたい状況があるかと思います。
        そういう時は、「<v-icon class="search-icon">mdi-magnify</v-icon> 詳細検索...」と表示されている箇所を選択します。
        すると、検索項目を選択・入力するための入力欄が表示されます。
        <v-img max-width="400" src="images/how-to-show-search-area.png"></v-img>
      </p>

      <p v-if="item.id == 'tips-to-search'" class="text-body-1">
        選択肢から選ぶタイプの検索方法を例に説明します。<br><br>

        選択肢から該当する項目をクリックすれば、すぐに検索結果が表示されている一覧に反映されます。
        複数の項目を選択すれば全てに該当する項目のみに絞れますし、「全て選択解除」ボタンを押すと
        選択されている全ての項目を選択解除できます。
        <v-img max-width="150" src="images/search-type-select.png"></v-img><br>

        なにかしら検索した状態のページは、「<v-icon class="search-icon">mdi-magnify</v-icon> 詳細検索...」部分の右端に
        <v-chip size="small" variant="elevated" color="orange-lighten-3">検索ワード入力中</v-chip>というマークが表示されます。
        <v-img max-width="700" src="images/searched-marker.png"></v-img><br>

        下図のように「<v-icon class="search-icon">mdi-magnify</v-icon> 詳細検索...」と表示されている箇所を選択することで、
        検索画面を小さく折りたたむことができます。検索条件を入力し終えて一覧を確認する際には、このように折りたたむと見やすくなります。
        <v-img max-width="700" src="images/how-to-close-search-area.png"></v-img>
      </p>

      <p v-if="item.id == 'copy-url-to-clipboard'" class="text-body-1">
        目的に合致するちょっと複雑な検索条件が入力できたら、症例が増えた場合などにも同じ条件で見たいという場合があるかと思います。<br><br>

        「URLコピー」ボタンを押してURLをコピーすることで、同じ検索条件が入力された状態のページのURLをコピーすることができます。
        ブラウザの別タブで開いてブックマーク登録しておけば、いつでも同じ検索条件を復元して内容を確認可能です。
        <v-img max-width="500" src="images/how-to-copy-url-with-custom-conditions.png"></v-img><br>

        また、他の方にメールやSNSを通じてURLを共有することで、複数人で同じ検索条件のページをみて議論するといったことも可能です。
        <v-alert class="mt-2" density="compact" title="ご注意" border="start" border-color="orange-darken-3" elevation="2"
          icon="mdi-alert-decagram-outline">
          本サイトのグラフ利用やSNSなどでの共有に関して注意事項があります。詳しくは <a href="#/about">Aboutページ</a> をご確認ください。
        </v-alert>
      </p>

      <p v-if="item.id == 'save-results-as-csv-file'" class="text-body-1">
        検索して絞り込んだ一覧を手元に保存したい場合や、Excelなどのスプレッドシートで独自の集計・グラフ化などを行いたい場合があると思います。<br><br>
        そういう場合には「CSVダウンロード」ボタンを押すことで、今の画面に表示されている検索結果一覧をCSV形式のテキストで保存可能です。
        <v-img max-width="500" src="images/how-to-download-result-as-csv-file.png"></v-img><br>

        <v-alert class="mt-2" density="compact" title="ご注意" border="start" border-color="orange-darken-3" elevation="2"
          icon="mdi-alert-decagram-outline">
          本サイトのグラフ利用やSNSなどでの共有に関して注意事項があります。詳しくは <a href="#/about">Aboutページ</a> をご確認ください。
        </v-alert>
      </p>

      <p v-if="item.id == 'clear-search-conditions'" class="text-body-1">
        あれこれ試行錯誤していて「ごちゃごちゃになった、検索条件をまっさらにしたい」という状況が
        あるかもしれません。そういう時には、「検索条件クリア」ボタンを押してください。
        <v-img max-width="500" src="images/clear-searching-conditions.png"></v-img><br>

        下図のような確認画面が表示されますので、「はい」を選択すれば全ての検索条件がまっさらにクリアされます。
        <v-img max-width="400" src="images/confirmation-to-clear-searching-conditions.png"></v-img>
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

const howToSearchChapter2 = { title: '検索機能の使い方', id: 'how-to-search' }
const howToSearchChapter3List = [
  { title: '検索画面を開く', id: 'show-search-window' },
  { title: '検索条件を入力する', id: 'tips-to-search' },
  { title: '検索条件のURLをコピーする', id: 'copy-url-to-clipboard' },
  { title: '検索結果をCSVファイルに保存する', id: 'save-results-as-csv-file' },
  { title: '検索条件をクリアする', id: 'clear-search-conditions' }
]

const scrollView = (id: string) => {
  const chapterElement = document.getElementById(id)
  if (chapterElement != null) {
    chapterElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    router.push({ path: 'how-to-use-search-feature', query: { anchor: id } })
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

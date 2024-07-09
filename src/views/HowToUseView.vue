<template>
  <v-container>

    <v-navigation-drawer location="right" temporary width="15rem" v-model="tocDrawer">
      <v-list density="compact" nav>
        <v-list-item @click="scrollView(howToSearchChapter2.id)">{{ howToSearchChapter2.title }}</v-list-item>
        <v-list-item class="pl-6" v-for="item in howToSearchChapter3List" :key="item.id" :title="item.title"
          @click="scrollView(item.id)"></v-list-item>

        <v-list-item @click="scrollView(howToUseIssueListChapter2.id)">{{ howToUseIssueListChapter2.title }}</v-list-item>
        <v-list-item class="pl-6" v-for="item in howToUseIssueListChapter3List" :key="item.id" :title="item.title"
          @click="scrollView(item.id)"></v-list-item>

        <v-list-item @click="scrollView(howToUseSummaryPageChapter2.id)">{{ howToUseSummaryPageChapter2.title }}</v-list-item>
        <v-list-item class="pl-6" v-for="item in howToUseSummaryPageChapter3List" :key="item.id" :title="item.title"
          @click="scrollView(item.id)"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-sheet>
      <h2 class="text-h4 mb-2" :id="howToSearchChapter2.id">{{ howToSearchChapter2.title }}
        <v-snackbar :timeout="2000" color="blue-grey-darken-3">
          <template v-slot:activator="{ props }">
            <v-btn class="mb-1" size="x-small" prepend-icon="mdi-link-variant" variant="outlined" @click="copyLink($event)" v-bind="props">コピー</v-btn>
          </template>
          クリップボードにリンクURLをコピーしました!
        </v-snackbar>
      </h2>
      <p class="text-body-1">
        判定結果や症例など、多数のデータが一覧表示されているページでの検索機能の使い方を解説します。
      </p>
    </v-sheet>

    <v-sheet v-for="item in howToSearchChapter3List" :key="item.id">
      <h3 :id="item.id" class="text-h5 mt-10 mb-2">{{ item.title }}
        <v-snackbar :timeout="2000" color="blue-grey-darken-3">
          <template v-slot:activator="{ props }">
            <v-btn class="mb-1" size="x-small" prepend-icon="mdi-link-variant" variant="outlined" @click="copyLink($event)" v-bind="props">コピー</v-btn>
          </template>
          クリップボードにリンクURLをコピーしました!
        </v-snackbar>
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

    <v-sheet>
      <h2 class="text-h4 mt-15 mb-2" :id="howToUseIssueListChapter2.id">{{ howToUseIssueListChapter2.title }}
        <v-snackbar :timeout="2000" color="blue-grey-darken-3">
          <template v-slot:activator="{ props }">
            <v-btn class="mb-1" size="x-small" prepend-icon="mdi-link-variant" variant="outlined" @click="copyLink($event)" v-bind="props">コピー</v-btn>
          </template>
          クリップボードにリンクURLをコピーしました!
        </v-snackbar>
      </h2>
      <p class="text-body-1">
        判定結果や症例など、データが一覧表示されているページでのデータ確認方法を解説します。
      </p>
    </v-sheet>

    <v-sheet v-for="item in howToUseIssueListChapter3List" :key="item.id">
      <h3 :id="item.id" class="text-h5 mt-8 mb-2">{{ item.title }}
        <v-snackbar :timeout="2000" color="blue-grey-darken-3">
          <template v-slot:activator="{ props }">
            <v-btn class="mb-1" size="x-small" prepend-icon="mdi-link-variant" variant="outlined" @click="copyLink($event)" v-bind="props">コピー</v-btn>
          </template>
          クリップボードにリンクURLをコピーしました!
        </v-snackbar>
      </h3>

      <p v-if="item.id == 'sort-issue-list'" class="text-body-1">
        一覧の一番上のヘッダ部分を下図のオレンジ枠のように選択することで、選択した列の内容で並べ替えて表示できます。
        <v-img max-width="500" src="images/click-sort-button-on-header.png"></v-img><br>
        もう一度押すと並べ替えの昇順と降順を切り替えることができ、さらに押すことで並べ替えを解除できます。
        <v-img max-width="500" src="images/changing-ascending-desending.png"></v-img>
      </p>

      <p v-if="item.id == 'show-detail-info-timeline-etc'" class="text-body-1">
        一覧の行の左端に下向き三角のアイコンが表示されている場合があります。その場合は、行を選択することで
        下図のように時系列データなど詳細な内容を表示して確認することができます。
        <v-img max-width="700" src="images/show-detail-area-with-timeline.png"></v-img><br>
        同時に複数の行を詳細表示することもできますし、該当行をもう一度選択すれか「詳細表示を閉じる」ボタンを押すことで
        元の通りに折りたたむことができます。
        <v-img max-width="500" src="images/close-detail-area.png"></v-img>
      </p>

      <p v-if="item.id == 'confirm-original-data'" class="text-body-1">
        一覧の該当行が掲載されていた元資料（厚生労働省が公開したPDF）を表示することができます。
        <v-img max-width="500" src="images/link-to-source-pdf.png"></v-img>
      </p>
    </v-sheet>

    <v-sheet>
      <h2 class="text-h4 mt-15 mb-2" :id="howToUseSummaryPageChapter2.id">{{ howToUseSummaryPageChapter2.title }}
        <v-snackbar :timeout="2000" color="blue-grey-darken-3">
          <template v-slot:activator="{ props }">
            <v-btn class="mb-1" size="x-small" prepend-icon="mdi-link-variant" variant="outlined" @click="copyLink($event)" v-bind="props">コピー</v-btn>
          </template>
          クリップボードにリンクURLをコピーしました!
        </v-snackbar>
      </h2>
      <p class="text-body-1">
        判定結果などの情報を集計したサマリ情報をグラフなどで表示しているサマリページの使い方を説明します。
      </p>
    </v-sheet>

    <v-sheet v-for="item in howToUseSummaryPageChapter3List" :key="item.id">
      <h3 :id="item.id" class="text-h5 mt-8 mb-2">{{ item.title }}
        <v-snackbar :timeout="2000" color="blue-grey-darken-3">
          <template v-slot:activator="{ props }">
            <v-btn class="mb-1" size="x-small" prepend-icon="mdi-link-variant" variant="outlined" @click="copyLink($event)" v-bind="props">コピー</v-btn>
          </template>
          クリップボードにリンクURLをコピーしました!
        </v-snackbar>
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

const howToUseIssueListChapter2 = { title: 'データ一覧の使い方', id: 'how-to-use-issue-list' }
const howToUseIssueListChapter3List = [
  { title: '一覧を並べ替える', id: 'sort-issue-list' },
  { title: '時系列など詳しい情報を確認する', id: 'show-detail-info-timeline-etc' },
  { title: '元資料を確認する', id: 'confirm-original-data' }
]

const howToUseSummaryPageChapter2 = { title: 'サマリページの使い方', id: 'how-to-use-summary' }
const howToUseSummaryPageChapter3List = [
  { title: 'グラフの各項目で件数を確認する', id: 'confirm-issue-counts' },
  { title: 'グラフをCSVや画像で保存する', id: 'save-graph-data-as-csv-etc' }
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
h2,
h3 {
  scroll-margin-top: 5rem;
  /* whatever is a nice number that gets you past the header */
}
</style>

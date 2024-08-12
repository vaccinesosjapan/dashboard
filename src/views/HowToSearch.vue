<template>
  <v-container>

    <v-card title="目次" valiant="outlined" color="indigo-darken-3">
      <v-list density="compact" nav>
        <v-list-item class="pl-6" v-for="item in sectionList" :key="item.id" @click="scrollView(item.id)">
            <v-icon icon="mdi-square-medium"></v-icon> {{ item.title }}
        </v-list-item>
      </v-list>
    </v-card>

    <v-sheet>
      <h3 :id="sectionOpenSearchWindow.id" class="text-h5 mt-10 mb-2">{{ sectionOpenSearchWindow.title }}
        <CopyLinkSnackBar :id="sectionOpenSearchWindow.id"></CopyLinkSnackBar>
      </h3>
      <p class="text-body-1">
        オレンジ枠の部分をクリック（タップ）すると、検索画面が開きます。
        <v-img src="images/how-to-search/open-search-window.png"></v-img><br>
      </p>
    </v-sheet>

    <v-sheet>
      <h3 :id="sectionFilterByClaim.id" class="text-h5 mt-10 mb-2">{{ sectionFilterByClaim.title }}
        <CopyLinkSnackBar :id="sectionFilterByClaim.id"></CopyLinkSnackBar>
      </h3>
      <p class="text-body-1">
        検索画面の「請求内容」欄に「医療」や「年金」などのキーワードを入力すると、該当する請求内容の判定結果だけを一覧表示できます。
        <v-img src="images/how-to-search/set-claim-keyword.png"></v-img><br>
      </p>
    </v-sheet>

    <v-sheet>
      <h3 :id="sectionFilterBySymptoms.id" class="text-h5 mt-10 mb-2">{{ sectionFilterBySymptoms.title }}
        <CopyLinkSnackBar :id="sectionFilterBySymptoms.id"></CopyLinkSnackBar>
      </h3>
      <p class="text-body-1">
        検索画面の「症状」欄に症状名の一部を入力すると、該当する判定結果だけを一覧表示できます。
        <v-img src="images/how-to-search/set-symptoms-keyword.png"></v-img><br>
      </p>
    </v-sheet>

    <v-sheet>
      <h3 :id="sectionSortOnTableColumn.id" class="text-h5 mt-10 mb-2">{{ sectionSortOnTableColumn.title }}
        <CopyLinkSnackBar :id="sectionSortOnTableColumn.id"></CopyLinkSnackBar>
      </h3>
      <p class="text-body-1">
        並び替えをしたい項目の付近をクリック（タップ）すると、一覧を並べ替えて表示できます。
        並び順は、クリック（タップ）回数に応じて「昇順」「降順」「並べ替えなし」に切り替わります。
        <v-img src="images/how-to-search/sort-on-table-column.png"></v-img><br>
      </p>
    </v-sheet>

    <v-sheet>
      <h3 :id="sectionShowDetailInfo.id" class="text-h5 mt-10 mb-2">{{ sectionShowDetailInfo.title }}
        <CopyLinkSnackBar :id="sectionShowDetailInfo.id"></CopyLinkSnackBar>
      </h3>
      <p class="text-body-1">
        詳しい情報を見たい症例をクリック（タップ）すると、時系列での経過などが表示されます。
        もう一度症例をクリック（タップ）するか、「詳細表示を閉じる」ボタンを押せば元の表示に戻ります。
        <v-img src="images/how-to-search/show-detail-info.png"></v-img><br>
      </p>
    </v-sheet>

    <v-sheet>
      <h3 :id="sectionConfirmOriginalData.id" class="text-h5 mt-10 mb-2">{{ sectionConfirmOriginalData.title }}
        <CopyLinkSnackBar :id="sectionConfirmOriginalData.id"></CopyLinkSnackBar>
      </h3>
      <p class="text-body-1">
        「元資料」列のリンクをクリック（タップ）すると、厚生労働省サイトで症例が記載されていた元資料を確認できます。
        <v-img src="images/how-to-search/link-to-source-pdf.png"></v-img>
      </p>
    </v-sheet>

    <v-sheet>
      <h3 :id="sectionCopyFilterSettingsURL.id" class="text-h5 mt-10 mb-2">{{ sectionCopyFilterSettingsURL.title }}
        <CopyLinkSnackBar :id="sectionCopyFilterSettingsURL.id"></CopyLinkSnackBar>
      </h3>
      <p class="text-body-1">
        「URLコピー」ボタンを押すと、現在入力済みの検索結果ページのURLをコピーできます。
        ブラウザのブックマークとして保存したり、SNS<sup>※</sup>などで共有することができます。
        <v-img src="images/how-to-search/copy-filter-settings-url.png"></v-img>
        <v-alert class="mt-2" density="compact" title="ご注意" type="warning" elevation="2" border="start" border-color="orange-darken-4"
          icon="mdi-alert-decagram-outline">
          SNSなどでの共有に関して注意事項があります。詳しくは <a href="#/about">Aboutページ</a> をご確認ください。
        </v-alert>
      </p>
    </v-sheet>

    <v-sheet>
      <h3 :id="sectionClearSearchConditions.id" class="text-h5 mt-10 mb-2">{{ sectionClearSearchConditions.title }}
        <CopyLinkSnackBar :id="sectionClearSearchConditions.id"></CopyLinkSnackBar>
      </h3>
      <p class="text-body-1">
        検索し直したい場合など、全件表示に戻すには「検索条件クリア」ボタンを押します。
        <v-img src="images/how-to-search/clear-searching-conditions.png"></v-img><br>
        下図のような確認画面で「はい」を選択すれば、検索条件を初期化できます。
        <v-img src="images/how-to-search/confirmation-to-clear-searching-conditions.png"></v-img>
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

const sectionOpenSearchWindow = { title: '検索画面を開く', id: 'open-search-window' }
const sectionFilterByClaim = { title: '請求内容で検索する', id: 'search-by-claim' }
const sectionFilterBySymptoms = { title: '症例で検索する', id: 'search-by-symptoms' }
const sectionSortOnTableColumn = { title: '項目を並べ替える', id: 'sort-on-table-column' }
const sectionShowDetailInfo = { title: '検索結果の詳細を見る', id: 'show-detail-info' }
const sectionConfirmOriginalData = { title: '厚生労働省から発表された資料を確認', id: 'confirm-original-data' }
const sectionCopyFilterSettingsURL = { title: '検索結果ページを共有する', id: 'copy-filter-settings-url' }
const sectionClearSearchConditions = { title: '全件表示に戻す場合', id: 'clear-search-conditions' }
const sectionList = [
  sectionOpenSearchWindow,
  sectionFilterByClaim,
  sectionFilterBySymptoms,
  sectionSortOnTableColumn,
  sectionShowDetailInfo,
  sectionConfirmOriginalData,
  sectionCopyFilterSettingsURL,
  sectionClearSearchConditions
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

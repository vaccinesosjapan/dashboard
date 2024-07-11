<template>
  <v-container>

    <v-navigation-drawer location="right" temporary width="15rem" v-model="tocDrawer">
      <v-list density="compact" nav>
        <v-list-item @click="scrollView(howToUseIssueListChapter2.id)">{{ howToUseIssueListChapter2.title }}</v-list-item>
        <v-list-item class="pl-6" v-for="item in howToUseIssueListChapter3List" :key="item.id" :title="item.title"
          @click="scrollView(item.id)"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-sheet>
      <h2 class="text-h4 mb-2" :id="howToUseIssueListChapter2.id">{{ howToUseIssueListChapter2.title }}
        <CopyLinkSnackBar :id="howToUseIssueListChapter2.id"></CopyLinkSnackBar>
      </h2>
      <p class="text-body-1">
        判定結果や症例など、データが一覧表示されているページでのデータ確認方法を解説します。
      </p>
    </v-sheet>

    <v-sheet v-for="item in howToUseIssueListChapter3List" :key="item.id">
      <h3 :id="item.id" class="text-h5 mt-8 mb-2">{{ item.title }}
        <CopyLinkSnackBar :id="item.id"></CopyLinkSnackBar>
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

const howToUseIssueListChapter2 = { title: 'データ一覧の使い方', id: 'how-to-use-issue-list' }
const howToUseIssueListChapter3List = [
  { title: '一覧を並べ替える', id: 'sort-issue-list' },
  { title: '時系列など詳しい情報を確認する', id: 'show-detail-info-timeline-etc' },
  { title: '元資料を確認する', id: 'confirm-original-data' }
]

const scrollView = (id: string) => {
  const chapterElement = document.getElementById(id)
  if (chapterElement != null) {
    chapterElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    router.push({ path: 'how-to-use-issue-list', query: { anchor: id } })
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

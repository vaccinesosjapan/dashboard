<script setup lang="ts">
import { AppBarTitle, AppBarColor, AppBarUseHelpPage, AppBarHelpPageLink } from '@/router/data'
import router from '@/router/index'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = 'blue-grey-lighten-4'
AppBarUseHelpPage.value = false
AppBarHelpPageLink.value = ''
</script>

<template>
  <v-container>
    <v-sheet>
      <h2 class="text-h4 mb-2">本サイトについて</h2>
      <p class="text-body-1">
        厚生労働省のサイトには、新型コロナワクチンの「<a href="https://www.mhlw.go.jp/stf/shingi/shingi-kousei_284075.html">副反応疑い報告</a>」や「<a href="https://www.mhlw.go.jp/stf/shingi/shingi-shippei_127696_00001.html">予防接種健康被害</a>」に関する情報が
        PDF形式で多数掲載されています。本サイトは、ダッシュボードを中心にそれらのデータを見やすく整理して検索可能にし、多くの人にとって、より見やすく、知見を得やすい情報源にするためのサイトです。
      </p>

      <h3 class="text-h5 mt-10 mb-2">データおよびその利用について</h3>
      <p class="text-body-1">
        本サイトは、厚生労働省のホームページに掲載されているPDF資料から抽出したデータを使っています。
        できるだけ正確に情報を抽出するよう努めておりますが、データの正確さについて、本サイトは一切の責任を負いません。
      </p>
      <p class="text-body-1 mt-4">
        また、本サイトからCSV形式などでダウンロード可能なデータの取り扱いについては、元データを提供している厚生労働省が定めるコンテンツ利用の規約に準拠します。
        詳しくは厚生労働省のホームページに記載の <a href="https://www.mhlw.go.jp/chosakuken/index.html">利用規約・リンク・著作権等</a> をご覧ください。
      </p>

      <h3 class="text-h5 mt-10 mb-2">所有者</h3>
      <p class="text-body-1">
        本サイトの所有者は <a href="https://vaccinesosjapan.wixsite.com/website">新型コロナワクチン後遺症 患者の会</a> です。
      </p>

       <v-card class="mx-auto mt-10 mb-10" elevation="6">
        <template v-slot:title>
          <span class="font-weight-black">本サイトのグラフなどの利用について</span>
        </template>
        <v-card-text class="text-body-1">
          <v-row>
            <v-col cols="1">
              <v-icon icon="mdi-alert-decagram-outline" size="70" color="warning"></v-icon>
            </v-col>
            <v-col cols="11">
              <ul class="pl-10 mt-2">
                <li class="text-body-1 yuttari">
                本サイトのグラフや表など「データを可視化したコンテンツ」を、SNSで引用するなど多くの人に共有する使い方をする場合、本ダッシュボードのURLと共に
                共有してください。
                </li>
                <li class="text-body-1 yuttari mt-2">
                引用したコンテンツならびに加工したコンテンツを、「自分が作った」と偽る行為を禁じます。
                </li>
                <li class="text-body-1 yuttari mt-2">
                講演会での利用や著作物への引用など<span class="big-bold">営利目的で利用する場合</span>の、<span class="big-bold">無断使用を禁じます。</span>
                必ず事前に所有者に許可を得てください。
                </li>
                <li>
                  資料に掲載する場合は、「<span class="big-bold">新型コロナワクチン後遺症 患者の会</span>」ダッシュボードとしてクレジットを掲載ください。
                </li>
              </ul>
            </v-col>
          </v-row>

        </v-card-text>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<style scoped lang="css">
.big-bold {
  font-size: 1.4rem;
  font-weight: bolder;
}

.wave-under-bar{
  text-decoration: underline;
  text-underline-offset: 4px;
}

.yuttari {
  line-height: 1.8rem;
}
</style>

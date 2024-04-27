<template>
  <v-container>
    <v-card color="light-blue-darken-1" variant="elevated">
      <v-card-title>副反応疑い報告</v-card-title>
      <v-card-text class="card-text">
        医療機関や製造販売業者（製薬会社）から「新型コロナワクチンによる副反応疑い」として報告された案件を検索できます。
      </v-card-text>

      <v-item-group selected-class="bg-primary">

        <v-container>
          <h4>医療機関からの報告</h4>
          <v-row>
            <v-col cols="12" lg="3" md="4" sm="6">
              <v-btn :prepend-icon="MedialInstitutionHomeRoute.icon" size="x-large" :href="`${baseURL}#${MedialInstitutionHomeRoute.path}`" min-width="17rem">{{ MedialInstitutionHomeRoute.menu_name }}</v-btn>
            </v-col>
            <v-col cols="12" lg="3" md="4" sm="6" v-for="(r, i) in MedialInstitutionRoutes" :key="i">
              <v-btn :prepend-icon="r.icon" size="x-large" :href="`${baseURL}#${r.path}`" min-width="17rem">{{ r.menu_name }}</v-btn>
            </v-col>
          </v-row>
        </v-container>

        <v-container>
          <h4>製造販売業者からの報告</h4>
          <v-row>
            <v-col cols="12" lg="3" md="4" sm="6">
              <v-btn :prepend-icon="SuspectedIssuesHomeRoute.icon" size="x-large" :href="`${baseURL}#${SuspectedIssuesHomeRoute.path}`" min-width="17rem">{{ SuspectedIssuesHomeRoute.menu_name }}</v-btn>
            </v-col>
            <v-col cols="12" lg="3" md="4" sm="6" v-for="(r, i) in SuspectedIssuesSubRoutes" :key="i">
              <v-btn :prepend-icon="r.icon" size="x-large" :href="`${baseURL}#${r.path}`" min-width="17rem">{{ r.menu_name }}</v-btn>
            </v-col>
          </v-row>
        </v-container>

      </v-item-group>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn
          @click="expandSuspectedIssues = !expandSuspectedIssues"
          elevation="1"
          variant="outlined"
        >
          {{ !expandSuspectedIssues ? '制度に関する情報はこちら' : '詳細情報を閉じる' }}
        </v-btn>
      </v-card-actions>

      <v-expand-transition>
        <v-card v-if="expandSuspectedIssues" color="light-blue-darken-1">
          <v-card-text
            >「
            <a
              rel="nofollow"
              href="https://www.pmda.go.jp/safety/reports/hcp/prev-vacc-act/0003.html"
              >予防接種法に関する報告の制度について</a
            >
            」や 「
            <a
              rel="nofollow"
              href="https://www.cao.go.jp/consumer/history/01/kabusoshiki/tokuho/doc/110228_shiryou6.pdf"
              >薬事法に基づく医薬品の副作用報告 について（概要）</a
            >
            」などをご覧ください。</v-card-text
          >
        </v-card>
      </v-expand-transition>
    </v-card>
  </v-container>

  <v-container>
    <v-card color="green-darken-1" variant="elevated">
      <v-card-title>予防接種健康被害 救済制度</v-card-title>
      <v-card-text class="card-text">
        新型コロナワクチンの接種による健康被害として認定された症状などを検索できます。
      </v-card-text>

      <v-item-group selected-class="bg-primary">
        <v-container>
          <v-row>
            <v-col cols="12" lg="3" md="4" sm="6">
              <v-btn :prepend-icon="HealthHazardsHomeRoute.icon" size="x-large" :href="`${baseURL}#${HealthHazardsHomeRoute.path}`" min-width="17rem">{{ HealthHazardsHomeRoute.menu_name }}</v-btn>
            </v-col>
          </v-row>
        </v-container>

        <v-container>
          <h4>判定済みの案件</h4>
          <v-row>
            <v-col cols="12" lg="3" md="4" sm="6" v-for="(r, i) in HealthHazardsSubRoutes" :key="i">
              <v-btn :prepend-icon="r.icon" size="x-large" :href="`${baseURL}#${r.path}`" min-width="17rem">{{ r.menu_name }}</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-item-group>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn
          @click="expandCertifiedIssues = !expandCertifiedIssues"
          elevation="1"
          variant="outlined"
        >
          {{ !expandCertifiedIssues ? '制度に関する情報はこちら' : '詳細情報を閉じる' }}
        </v-btn>
      </v-card-actions>

      <v-expand-transition>
        <v-card v-if="expandCertifiedIssues" color="green-darken-1">
          <v-card-text
            >「
            <a
              rel="nofollow"
              href="https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/vaccine_kenkouhigaikyuusai.html"
              >予防接種健康被害救済制度</a
            >
            」や 「
            <a
              rel="nofollow"
              href="https://www.pmda.go.jp/safety/reports/hcp/prev-vacc-act/0003.html"
              >予防接種法に関する報告の制度について</a
            >
            」、 「
            <a rel="nofollow" href="https://www.mhlw.go.jp/content/10900000/000912784.pdf"
              >予防接種後健康被害救済制度について</a
            >
            」などをご覧ください。</v-card-text
          >
        </v-card>
      </v-expand-transition>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { AppBarTitle, AppBarColor } from '@/router/data'
import {
  HealthHazardsHomeRoute,
  HealthHazardsSubRoutes,
  SuspectedIssuesHomeRoute,
  SuspectedIssuesSubRoutes,
  MedialInstitutionHomeRoute,
  MedialInstitutionRoutes
} from '@/router/routes'
import { shallowRef } from 'vue'
import router from '@/router/index'

AppBarTitle.value = String(router.currentRoute.value.name)
AppBarColor.value = '#E57373'

const baseURL = import.meta.env.BASE_URL
const expandSuspectedIssues = shallowRef(false)
const expandCertifiedIssues = shallowRef(false)
</script>

<style scoped>
h4 {
  font-weight: normal;
}
h4:before {
  content: '●';
  color: white;
  margin-right: 3px;
}
</style>

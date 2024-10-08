<script setup lang="ts">
import { RouterView } from 'vue-router'
import {
  SuspectedIssuesHomeRoute,
  SuspectedIssuesSubRoutes,
  MedialInstitutionHomeRoute,
  MedialInstitutionRoutes,
  MedialInstitutionReferenceRoute,
  HealthHazardsHomeRoute,
  AboutRoute,
  HowToUseSearchPageRoutes,
  HomeRoute,
  HealthHazardsSubRoutes
} from '@/router/routes'
import { AppBarTitle, AppBarColor, AppBarUseHelpPage, AppBarHelpPageLink } from '@/router/data'
import { shallowRef } from 'vue'

const baseURL = import.meta.env.BASE_URL

const selectedItem = shallowRef('')
const drawer = shallowRef<boolean>(false)

// メモ:
// v-app-bar-title を使うと画面サイズによってはタイトルが文字切れしてしまうため、独自の実装で
// 文字切れしないようにしている。
</script>

<template>
  <v-app>
    <v-app-bar app :color="AppBarColor">
      <template v-slot:prepend>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title class="d-none d-sm-flex">{{ AppBarTitle }}</v-toolbar-title>
        <v-toolbar-title class="d-flex d-sm-none small-app-title">
          <span v-for="(item, index) in AppBarTitle.split('-')" :key="index">{{ item }}<br></span>
        </v-toolbar-title>
        <v-hover v-if="AppBarUseHelpPage">
          <template v-slot:default="{ isHovering, props }">
            <v-btn prepend-icon="mdi-book-open-page-variant-outline" :href="`${baseURL}#${AppBarHelpPageLink}`"
              class="ml-4" variant=elevated v-bind="props" :color="isHovering ? 'grey-lighten-2' : undefined" :elevation="isHovering ? 10 : 2" text="使い方"></v-btn>
          </template>
        </v-hover>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary width="10rem">
      <v-list>
        <v-list-item>
          <v-list-item-title class="title">
            <span class="font-weight-bold">副反応ダッシュボード</span>
          </v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item
          :prepend-icon="HomeRoute.icon"
          :value="HomeRoute.name"
          :href="`${baseURL}#${HomeRoute.path}`"
          class="root-icon home"
          :active="HomeRoute.name === selectedItem"
          @click="selectedItem = HomeRoute.name"
        >
          <v-list-item-title class="root-title">{{ HomeRoute.menu_name }}</v-list-item-title>
        </v-list-item>

        <v-list-group value="MedicalInstitutionIssues">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-file-document-alert-outline"
              class="root-icon suspeted-issue-root"
            >
              <v-list-item-title class="d-none d-sm-flex root-title"
                >医療機関からの報告</v-list-item-title
              >
              <v-list-item-title class="d-flex d-sm-none root-small-title2"
                >医療機関からの報告</v-list-item-title
              >
            </v-list-item>
          </template>

          <v-list-item
            :prepend-icon="MedialInstitutionHomeRoute.icon"
            :href="`${baseURL}#${MedialInstitutionHomeRoute.path}`"
            class="sub-icon suspeted-issue-sub"
            :active="MedialInstitutionHomeRoute.name === selectedItem"
            @click="selectedItem = MedialInstitutionHomeRoute.name"
          >
            <v-list-item-title class="sub-title suspeted-issue-sub">{{
              MedialInstitutionHomeRoute.menu_name
            }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-for="(r, i) in MedialInstitutionRoutes"
            :key="i"
            :prepend-icon="r.icon"
            :value="r.name"
            :href="`${baseURL}#${r.path}`"
            class="sub-icon suspeted-issue-sub"
            :active="r.name === selectedItem"
            @click="selectedItem = r.name"
          >
            <v-list-item-title class="sub-title suspeted-issue-sub">{{
              r.menu_name
            }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            :prepend-icon="MedialInstitutionReferenceRoute.icon"
            :href="`${baseURL}#${MedialInstitutionReferenceRoute.path}`"
            class="sub-icon suspeted-issue-sub"
            :active="MedialInstitutionReferenceRoute.name === selectedItem"
            @click="selectedItem = MedialInstitutionReferenceRoute.name"
          >
            <v-list-item-title class="sub-title suspeted-issue-sub">{{
              MedialInstitutionReferenceRoute.menu_name
            }}</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group value="SuspectedIssues">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-file-document-alert-outline"
              class="root-icon suspeted-issue-root"
            >
              <v-list-item-title class="d-none d-sm-flex root-title"
                >製造販売業者からの報告</v-list-item-title
              >
              <v-list-item-title class="d-flex d-sm-none root-small-title2"
                >製造販売業者からの報告</v-list-item-title
              >
            </v-list-item>
          </template>

          <v-list-item
            :prepend-icon="SuspectedIssuesHomeRoute.icon"
            :href="`${baseURL}#${SuspectedIssuesHomeRoute.path}`"
            class="sub-icon suspeted-issue-sub"
            :active="SuspectedIssuesHomeRoute.name === selectedItem"
            @click="selectedItem = SuspectedIssuesHomeRoute.name"
          >
            <v-list-item-title class="sub-title suspeted-issue-sub">{{
              SuspectedIssuesHomeRoute.menu_name
            }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-for="(r, i) in SuspectedIssuesSubRoutes"
            :key="i"
            :prepend-icon="r.icon"
            :value="r.name"
            :href="`${baseURL}#${r.path}`"
            class="sub-icon suspeted-issue-sub"
            :active="r.name === selectedItem"
            @click="selectedItem = r.name"
          >
            <v-list-item-title class="sub-title suspeted-issue-sub">{{
              r.menu_name
            }}</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group value="HealthProtection">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-medical-bag"
              class="root-icon health-hazards-root"
            >
              <v-list-item-title class="d-none d-sm-flex root-title health-hazards-root"
                >予防接種健康被害 救済制度</v-list-item-title
              >
              <v-list-item-title class="d-flex d-sm-none root-small-title health-hazards-root"
                >予防接種健康被害 救済制度</v-list-item-title
              >
            </v-list-item>
          </template>

          <v-list-item
            :prepend-icon="HealthHazardsHomeRoute.icon"
            :href="`${baseURL}#${HealthHazardsHomeRoute.path}`"
            class="sub-icon health-hazards-sub"
            :active="HealthHazardsHomeRoute.name === selectedItem"
            @click="selectedItem = HealthHazardsHomeRoute.name"
          >
            <v-list-item-title class="sub-title health-hazards-sub">{{
              HealthHazardsHomeRoute.menu_name
            }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-for="(r, i) in HealthHazardsSubRoutes"
            :key="i"
            :prepend-icon="r.icon"
            :value="r.name"
            :href="`${baseURL}#${r.path}`"
            class="sub-icon health-hazards-sub"
            :active="r.name === selectedItem"
            @click="selectedItem = r.name"
          >
            <v-list-item-title class="sub-title health-hazards-sub">{{
              r.menu_name
            }}</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group value="HowToUseSeries">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-book-open-page-variant-outline"
              class="root-icon"
            >
              <v-list-item-title class="d-none d-sm-flex root-title"
                >使い方の説明</v-list-item-title
              >
              <v-list-item-title class="d-flex d-sm-none root-small-title2"
                >使い方の説明</v-list-item-title
              >
            </v-list-item>
          </template>

          <v-list-item
            v-for="(r, i) in HowToUseSearchPageRoutes"
            :key="i"
            :prepend-icon="r.icon"
            :value="r.name"
            :href="`${baseURL}#${r.path}`"
            class="sub-icon"
            :active="r.name === selectedItem"
            @click="selectedItem = r.name"
          >
            <v-list-item-title class="sub-title">{{ r.menu_name }}</v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-item
          :prepend-icon="AboutRoute.icon"
          :value="AboutRoute.name"
          :href="`${baseURL}#${AboutRoute.path}`"
          class="root-icon"
          :active="AboutRoute.name === selectedItem"
          @click="selectedItem = AboutRoute.name"
        >
          <v-list-item-title class="root-title">{{ AboutRoute.menu_name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- アプリケーションのコンポーネントに基づいてコンテンツのサイズを決定 -->
    <v-main>
      <!-- アプリケーションに適切なgutterを提供 -->
      <v-container fluid>
        <!-- vue-routerを使用する場合 -->
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<style scoped>
.root-icon {
  font-size: 2rem;
}

.root-title {
  font-size: 1.5rem;
}
.root-small-title {
  font-size: 0.9rem;
}
.root-small-title2 {
  font-size: 1.0rem;
}

.sub-icon {
  font-size: 1.5rem;
}

.sub-title {
  font-size: 1.2rem;
}

.suspeted-issue-root {
  color: #2962ff;
}
.suspeted-issue-sub {
  color: #00b0ff;
}

.health-hazards-root {
  color: #00c853;
}
.health-hazards-sub {
  color: #558b2f;
}

.home {
  color: #c62828;
}

.small-app-title {
  font-size: 1rem;
}

.v-list-group {
  --prepend-width: 0.8rem;
}
</style>

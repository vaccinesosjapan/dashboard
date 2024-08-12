export const HomeRoute = {
  path: '/',
  name: 'トップページ',
  menu_name: 'トップページ',
  icon: 'mdi-home',
  component: () => import('../views/HomeView.vue')
}
export const AboutRoute = {
  path: '/about',
  name: '本サイトについて',
  menu_name: '本サイトについて',
  icon: 'mdi-information-outline',
  component: () => import('../views/AboutView.vue')
}

export const SuspectedIssuesHomeRoute = {
  path: '/suspected-issues-summary',
  name: '製造販売業者からの報告 - 集計結果',
  menu_name: '集計結果',
  icon: 'mdi-chart-bar',
  component: () => import('../views/SuspectedIssuesView.vue')
}
export const SuspectedIssuesSubRoutes = [
  {
    path: '/reported-myocarditis-issues',
    name: '製造販売業者からの報告 - 心筋炎/心膜炎報告',
    menu_name: '心筋炎/心膜炎報告を検索',
    icon: 'mdi-magnify',
    component: () => import('../views/MyocarditisView.vue')
  },
  {
    path: '/reported-death-issues',
    name: '製造販売業者からの報告 - 死亡報告',
    menu_name: '死亡報告を検索',
    icon: 'mdi-magnify',
    component: () => import('../views/DeathView.vue')
  },
  {
    path: '/reference-of-suspected-issues-reports',
    name: '製造販売業者からの報告 - 参考情報',
    menu_name: '参考情報',
    icon: 'mdi-information-outline',
    component: () => import('../views/SuspectedIssuesReferenceView.vue')
  }
]

export const MedialInstitutionHomeRoute = {
  path: '/summary-from-medical-institution',
  name: '医療機関からの報告 - 集計結果',
  menu_name: '集計結果',
  icon: 'mdi-chart-bar',
  component: () => import('../views/MedicalInstitutionSummaryView.vue')
}
export const MedialInstitutionRoutes = [
  {
    path: '/reports-from-medical-institution',
    name: '医療機関からの報告 - 副反応疑い報告',
    menu_name: '副反応疑い報告を検索',
    icon: 'mdi-magnify',
    component: () => import('../views/MedicalInstitutionView.vue')
  },
]
export const MedialInstitutionReferenceRoute = {
  path: '/reference-of-medical-institution-reports',
  name: '医療機関からの報告 - 副反応疑い報告の参考情報',
  menu_name: '参考情報',
  icon: 'mdi-information-outline',
  component: () => import('../views/MedicalInstitutionReferenceView.vue')
}

export const HealthHazardsHomeRoute = {
  path: '/certified-health-hazard-summary',
  name: '予防接種健康被害 救済制度 - 集計結果',
  menu_name: '集計結果',
  icon: 'mdi-chart-bar',
  component: () => import('../views/CertifiedHealthHazardsHomeView.vue')
}

export const HealthHazardsSubRoutes = [
  {
    path: '/certified-issues',
    name: '予防接種健康被害 救済制度 - 判定済み 報告一覧',
    menu_name: '判定済み一覧を検索',
    icon: 'mdi-magnify',
    component: () => import('../views/CertifiedHealthHazardsView.vue')
  },
  {
    path: '/certified-symptoms',
    name: '予防接種健康被害 救済制度 - 認定済み 症状一覧',
    menu_name: '認定済み症状を検索',
    icon: 'mdi-magnify',
    component: () => import('../views/CertifiedSymptomsView.vue')
  }
]

export const HowToUseSearchPageRoutes = [
  {
    path: '/how-to-search',
    name: '検索の仕方',
    menu_name: '検索の仕方',
    icon: 'mdi-book-open-page-variant-outline',
    component: () => import('../views/HowToSearch.vue')
  },
  {
    path: '/how-to-save',
    name: '保存の仕方',
    menu_name: '保存の仕方',
    icon: 'mdi-book-open-page-variant-outline',
    component: () => import('../views/HowToSave.vue')
  },
  {
    path: '/how-to-use-summary-page',
    name: '集計結果の使い方',
    menu_name: '集計結果の使い方',
    icon: 'mdi-book-open-page-variant-outline',
    component: () => import('../views/HowToUseSummary.vue')
  },
]

export const AllRoutes = [
  HomeRoute,
  ...HowToUseSearchPageRoutes,
  AboutRoute,
  SuspectedIssuesHomeRoute,
  ...SuspectedIssuesSubRoutes,
  MedialInstitutionHomeRoute,
  ...MedialInstitutionRoutes,
  MedialInstitutionReferenceRoute,
  HealthHazardsHomeRoute,
  ...HealthHazardsSubRoutes
]

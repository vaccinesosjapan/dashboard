import { createRouter, createWebHashHistory } from 'vue-router'
import { AllRoutes } from './routes'

//console.log('BASE_URL: ', import.meta.env.BASE_URL)

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: AllRoutes,
  scrollBehavior(to) {
    const param = to.query['anchor']
    if (param) {
      // why: https://v3.router.vuejs.org/ja/guide/advanced/scroll-behavior.html#%E9%9D%9E%E5%90%8C%E6%9C%9F%E3%81%AA%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%99
      // 邪悪なコード。画像が多いページだと描画の塩梅で位置ズレがひどいため何回かに分けて寄せてゆく。
      // Vue3よ、頼むから描画完了イベントを使えるようにしてくれ。
      return new Promise(() => {
        const chapterElement = document.getElementById(param.toString())
        setTimeout(() => {
          chapterElement?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 500)
        setTimeout(() => {
          chapterElement?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 1000)
        setTimeout(() => {
          chapterElement?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 1500)
        setTimeout(() => {
          chapterElement?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 2000)
      })
    } else {
      // クエリパラメータにanchorがない場合はページトップを表示する
      return { top: 0 }
    }
  },
})

export default router

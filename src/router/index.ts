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
      // 少し待ちを入れないと画像の描画が後になって、思ったような位置にスクロールできないため。
      // vueの仕組みで「画像も含めて全部読み込み完了」したタイミングがイベントとれるなら、
      // こんな固定時間の待ちをいれるなどという「環境によっては間に合わない or 待ちすぎ」
      // みたいなコードを入れる必要もなくなるはず。
      return new Promise(() => {
        setTimeout(() => {
          const chapterElement = document.getElementById(param.toString())
          chapterElement?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
        }, 500)
      })
    }
  },
})

export default router

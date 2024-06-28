import { createRouter, createWebHashHistory } from 'vue-router'
import { AllRoutes } from './routes'

//console.log('BASE_URL: ', import.meta.env.BASE_URL)

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: AllRoutes,
  scrollBehavior(to) {
    const param = to.query['anchor']
    if (param) {
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

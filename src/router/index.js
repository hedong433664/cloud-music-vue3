import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './router.config.js'
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router

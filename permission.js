import router from '@/router'
import { nextTick } from 'vue'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { useUserStore } from '@/stores/userStore'
// const whiteList = []
nextTick(() => {
  const userStore = useUserStore()
  if (userStore.isExpired()) {
    userStore.LOGOUT()
  }
})

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async(to, _from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})

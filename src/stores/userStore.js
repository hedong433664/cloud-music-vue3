import { defineStore } from 'pinia'
import { ref } from 'vue'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { getLoginStatusApi, logoutApi, getUserLikeMusicIdsApi, likeMusicApi } from '@/api'
import { usePlayerStore } from '@/stores/playerStore'
// 设置过期时长
const expireTime = 1000 * 60 * 60 * 24 * 3
export const useUserStore = defineStore('user', () => {
  const userInfo = ref({
    isLogin: false,
    cookie: null,
    loginDateTime: '',
    data: {
      cookie: '',
      avatarUrl: '',
      nickName: '',
      userId: '',
    },
    likeMusicIds: [],
  })

  const SET_COOKIE = cookie => {
    userInfo.value.cookie = cookie
  }

  const SET_DATA = data => {
    userInfo.value.data = data
    userInfo.value.isLogin = true
    userInfo.value.loginDateTime = dayjs().valueOf()
  }

  const SET_LIKE_MUSIC_IDS = ids => {
    userInfo.value.likeMusicIds = ids
  }

  const getToken = () => userInfo.value.token

  const getCookie = () => userInfo.value.cookie

  // 获取登录状态
  async function getLoginStatus(){
    const { data } = await getLoginStatusApi({ cookie: getCookie() })
    SET_DATA(data.profile)
    ElMessage.success('登录成功')
    getLikeMusicIds()
  }

  // 获取用户喜欢的音乐
  async function getLikeMusicIds(){
    const { ids } = await getUserLikeMusicIdsApi({ uid: userInfo.value.data.userId })
    SET_LIKE_MUSIC_IDS(ids)
  }

  async function handleLike(){
    // 判断是否登录
    if (!userInfo.value.isLogin) {
      return ElMessage.warning('请先登录')
    }
    // 判断是否登录过期
    if (isExpired()){
      return ElMessage.warning('登录状态已过期，请重新登录')
    }
    const playerStore = usePlayerStore()
    const id = playerStore.currentSong.id
    likeMusicApi({
      id,
      like: !userInfo.value.likeMusicIds.includes(id),
    })
    if (userInfo.value.likeMusicIds.includes(id)) {
      userInfo.value.likeMusicIds.splice(userInfo.value.likeMusicIds.indexOf(id), 1)
    }
    else {
      userInfo.value.likeMusicIds.push(id)
    }
  }

  // 退出登录
  async function LOGOUT(){
    await logoutApi({ cookie: getCookie() })
    userInfo.value.isLogin = false
    userInfo.value.cookie = null
    userInfo.value.loginDateTime = null
    userInfo.value.likeMusicIds = []
    userInfo.value.data = {
      cookie: '',
      avatarUrl: '',
      nickName: '',
      userId: '',
    }
    if (isExpired()){
      return ElMessage.warning('登录状态已过期，请重新登录')
    }
    ElMessage.success('退出登录成功')
  }

  function isExpired(){
    if (userInfo.value.loginDateTime) {
      return dayjs().valueOf() - userInfo.value.loginDateTime > expireTime
    }
    return false
  }

  return {
    userInfo,
    SET_COOKIE,
    SET_DATA,
    SET_LIKE_MUSIC_IDS,
    getToken,
    getCookie,
    getLoginStatus,
    getLikeMusicIds,
    handleLike,
    LOGOUT,
    isExpired,
  }
}, { persist: true })

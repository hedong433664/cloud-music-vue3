import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getMusicUrlApi, getLyricApi } from '@/api'
import { useUserStore } from '@/stores/userStore'

export const usePlayerStore = defineStore('player', () => {
  const userStore = useUserStore()
  const currentSong = ref({})
  const currentMusicUrl = ref('')
  const playList = ref([])
  const playState = ref(false)
  const currentTime = ref(0)
  const isLike = computed(() => userStore.userInfo.likeMusicIds.includes(currentSong.value.id))
  const isLoop = ref(false)

  // 更新播放时间
  function setCurrentTime(value){
    currentTime.value = value
  }

  // 更新播放状态
  function setPlayState(value){
    playState.value = value
  }

  // 更新播放模式
  function setLoop(){
    isLoop.value = !isLoop.value
  }

  // 播放全部
  function playAll(list){
    playList.value = list
    getSong(list[0])
  }

  // 获取音乐地址
  async function getSong(item, flag = true){
    if (currentSong.value.id === item.id && flag) {
      playState.value = !playState.value
      return
    }
    // 先获取音乐是否可用
    // const { message, success } = await getCheckMusicApi({ id: item.id })
    // if (!success) {
    //   ElMessage.error(message)
    //   return
    // }

    const { data } = await getMusicUrlApi({ id: item.id }) // 获取音乐地址
    currentMusicUrl.value = data[0].url
    currentSong.value = item
    if (!playList.value.find(v => v.id === item.id)) {
      playList.value.push(item)
    }
    // 获取音乐歌词
    const res = await getLyricApi({ id: item.id })
    // 直接通过换行符“\n”进行切割
    const lyricArr = []
    const lyric = res.lrc.lyric.split('\n')
    const reg = /\[\d*:\d*(\.|:)\d*]/g
    for (let i = 0; i < lyric.length; i++) {
      const timeRegArr = lyric[i].match(reg)
      if (!timeRegArr) {
        continue
      }
      // 获取歌词文本
      const text = lyric[i].replace(timeRegArr, '')
      // 转换歌词对应时间 [01:23.55] -> 83s
      const m = parseInt(timeRegArr[0].match(/\[\d*/i).toString().slice(1))
      // eslint-disable-next-line no-useless-escape
      const s = parseInt(timeRegArr[0].match(/\:\d*/i).toString().slice(1))
      const ms = parseInt(timeRegArr[0].match(/\.\d*/i).toString().slice(1))
      const time = parseInt(m * 60 + s + '.' + ms, 10)
      lyricArr.push({
        time, text,
      })
    }
    currentSong.value.lyric = lyricArr
  }

  // 上一首
  function prevMusic(){
    const index = playList.value.findIndex(item => item.id === currentSong.value.id)
    if (index === 0) {
      getSong(playList.value[playList.value.length - 1])
    }
    else {
      getSong(playList.value[index - 1])
    }
  }

  // 下一首
  function nextMusic(){
    const index = playList.value.findIndex(item => item.id === currentSong.value.id)
    if (index === playList.value.length - 1) {
      getSong(playList.value[0])
    }
    else {
      getSong(playList.value[index + 1])
    }
  }

  // 添加下一首
  function addMusic(item, isNext = false){
    // 歌单没有数据直接push并且播放
    if (playList.value.length === 0) {
      playList.value.push(item)
      getSong(item)
      return
    }
    // 判断是否已经存在
    if (playList.value.find(v => v.id === item.id)) {
      return
    }
    // 下一首放到当前播放之后
    if (isNext) {
      playList.value.splice(playList.value.findIndex(v => v.id === currentSong.value.id) + 1, 0, item)
    }
    else {
      playList.value.push(item)
    }
  }

  return {
    currentSong,
    currentMusicUrl,
    playList,
    getSong,
    prevMusic,
    nextMusic,
    addMusic,
    playState,
    setPlayState,
    currentTime,
    setCurrentTime,
    setLoop,
    isLoop,
    playAll,
    isLike,
  }
})

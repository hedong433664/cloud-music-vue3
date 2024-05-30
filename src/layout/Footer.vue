<template>
  <div class="footer-container">
    <div class="left-box">
      <div v-if="Object.keys(currentSong).length" class="disc" @click="lyricDrawer = true">
        <el-image
          class="disc-img"
          fit="cover"
          :src="picUrl(currentSong)"
          :style="{
            animationPlayState: playState ? 'running' : 'paused'
          }"
        />
      </div>
      <div v-if="Object.keys(currentSong).length" class="song">
        <div class="name-singer">
          <span class="name">{{ currentSong.name }} - </span>
          <span class="singer">{{ singer(currentSong) }}</span>
        </div>

        <div class="btn">
          <el-icon class="icon-btn" :size="20" @click="handleCommentDetail">
            <ChatDotRound />
          </el-icon>
          <el-icon class="icon-btn" :size="20" @click="downloadMusic">
            <Download />
          </el-icon>
        </div>
      </div>
    </div>
    <div class="content-box">
      <div class="btns">
        <i
          class="iconfont"
          :class="
            isLike ? 'icon-liked' : 'icon-like'
          "
          @click="userStore.handleLike"
        />
        <i class="iconfont icon-shangyishou" @click="playerStore.prevMusic" />
        <div class="play-icon" @click="handlePlay">
          <i v-if="playState" class="iconfont icon-zanting" />
          <i v-else class="iconfont icon-bofang" />
        </div>
        <i class="iconfont icon-xiayishou" @click="playerStore.nextMusic" />
        <i class="iconfont" :class="isLoop ? 'icon-danquxunhuan' : 'icon-liebiaoxunhuan'" @click="playerStore.setLoop" />
      </div>

      <div class="schedule">
        <span class="current-time">{{ formatTime(currentTime) }}</span>
        <el-slider
          v-model="sliderValue"
          class="slider"
          :show-tooltip="false"
          @change="handleSchedule"
        />
        <span class="total-time">{{ formatTime(totalTime) }}</span>
      </div>

      <!-- 音乐播放器 -->
      <audio
        ref="audioPlayerRef"
        :src="musicUrl"
        :loop="isLoop"
        @timeupdate="getCurrentTime"
        @pause="playState = false"
        @play="playState = true"
      />
    </div>
    <div class="right-box">
      <i class="iconfont icon-gedan" @click="openPlayListDraer" />

      <div class="volume-box">
        <i class="iconfont" :class="muted ? 'icon-jingyin' : 'icon-sound'" @click="handleMuted" />
        <el-slider
          v-model="volumeValue"
          class="volume-slider"
          :show-tooltip="false"
          :max="1"
          :step="0.1"
          @change="handleVolume"
        />
      </div>
    </div>

    <!-- 歌词抽屉 -->
    <el-drawer
      ref="LyricDrawerRef"
      v-model="lyricDrawer"
      class="lyric-drawer"
      direction="btt"
      title="歌词"
      size="100%"
      :modal="false"
      :show-close="false"
      :style="{
        background: drawerBgLinearGradient,
        backgroundColor: 'rgb(19, 19, 26)'
      }"
    >
      <template #header>
        <div class="drawer-header">
          <div class="btns">
            <el-button class="down-btn" type="info" plain @click="lyricDrawer = false">
              <el-icon :size="20">
                <ArrowDown />
              </el-icon>
            </el-button>

            <el-button class="quanping-btn" type="info" plain @click="handleScreenfull">
              <i class="iconfont icon-quanping" />
            </el-button>
          </div>
          <el-icon class="close-btn" :size="20" @click="lyricDrawer = false">
            <Close />
          </el-icon>
        </div>
      </template>

      <el-scrollbar ref="LyricScrollbarRef">
        <LyricDrawerBody :play-state="playState" @on-close-drawer="lyricDrawer = false" />
        <div class="comment-box">
          <Comment :id="currentSong.id" type="0" target-type="0" :show-loading="false" />
        </div>
      </el-scrollbar>

      <template #footer>
        <div class="drawer-footer">
          <el-slider
            v-model="sliderValue"
            class="footer-slider"
            :style="{
              '--slider-bar-linear-gradient': sliderBarLinearGradient
            }"
            :show-tooltip="false"
            @change="handleSchedule"
          />
          <div class="left-box">
            <el-icon class="icon-btn" :size="20" @click="handleCommentDetail">
              <ChatDotRound />
            </el-icon>
            <el-icon class="icon-btn" :size="20" @click="downloadMusic">
              <Download />
            </el-icon>

            <span class="current-time">{{ formatTime(currentTime) }}</span>
            <span class="division">&nbsp;/&nbsp;</span>
            <span class="total-time">{{ formatTime(totalTime) }}</span>
          </div>
          <div class="content-box">
            <div class="btns">
              <i
                class="iconfont"
                :class="
                  isLike ? 'icon-liked' : 'icon-like'
                "
                @click="userStore.handleLike"
              />
              <i class="iconfont icon-shangyishou" @click="playerStore.prevMusic" />
              <div class="play-icon" @click="handlePlay">
                <i v-if="playState" class="iconfont icon-zanting" />
                <i v-else class="iconfont icon-bofang" />
              </div>
              <i class="iconfont icon-xiayishou" @click="playerStore.nextMusic" />
              <i class="iconfont" :class="isLoop ? 'icon-danquxunhuan' : 'icon-liebiaoxunhuan'" @click="playerStore.setLoop" />
            </div>
          </div>

          <div class="right-box">
            <i class="iconfont icon-gedan" @click="openPlayListDraer" />

            <div class="volume-box">
              <i
                class="iconfont"
                :class="muted ? 'icon-jingyin' : 'icon-sound'"
                @click="handleMuted"
              />
              <el-slider
                v-model="volumeValue"
                class="volume-slider"
                :show-tooltip="false"
                :max="1"
                :step="0.1"
                @change="handleVolume"
              />
            </div>
          </div>
        </div>
      </template>
    </el-drawer>

    <!-- 歌单抽屉 -->
    <PlayListDrawer v-model:show="showPlayListDrawer" />
  </div>
</template>

<script setup>
import Comment from './../components/Comment.vue'
import { ref, nextTick, computed, watchEffect, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import { useUserStore } from '@/stores/userStore'
import { formatTime, throttle, getLinearGradient } from '@/utils'
import { saveAs } from 'file-saver'
import { ElMessage } from 'element-plus'
import LyricDrawerBody from './components/LyricDrawerBody.vue'
import PlayListDrawer from './components/PlayListDrawer.vue'
import Colorthief from 'colorthief'
import { ColorsEnum } from '@/common/ColorsEnum'
import { ArrowDown, Close, ChatDotRound, Download } from '@element-plus/icons-vue'
import screenfull from 'screenfull'

const playerStore = usePlayerStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const audioPlayerRef = ref()
const sliderValue = ref(0)
const volumeValue = ref(0.3) // 音量
const mutedBeforeVolumeValue = ref(0.3) // 静音前的音量
const muted = ref(false) // 静音状态
const playState = computed({
  get(){
    return playerStore.playState
  },
  set(value){
    playerStore.setPlayState(value)
  },
})
const musicUrl = computed(() => playerStore.currentMusicUrl)
const currentSong = computed(() => playerStore.currentSong)
const currentTime = computed({
  get(){
    return playerStore.currentTime
  },
  set(value){
    playerStore.setCurrentTime(value)
  },
})
const isLike = computed(() => playerStore.isLike)
const isLoop = computed(() => playerStore.isLoop)
const totalTime = ref(0)
const lyricDrawer = ref(false)
const showPlayListDrawer = ref(false)
const drawerBgLinearGradient = ref(
  'linear-gradient(to bottom, rgba(19, 19, 26, 1.0), rgba(19, 19, 26, 0.6), rgba(19, 19, 26, 0.2)',
)
const sliderBarLinearGradient = ref(
  'linear-gradient(to right, rgba(252, 61, 75, 0.2), rgba(252, 61, 75, 0.6), rgba(252, 61, 75, 1.0)',
)
const LyricScrollbarRef = ref(null)

watchEffect(() => {
  if (musicUrl.value) {
    nextTick(() => {
      audioPlayerRef?.value.pause()
      // 播放完成后自动播放下一首
      setTimeout(() => {
        audioPlayerRef.value.volume = volumeValue.value
        audioPlayerRef.value.play()
      }, 100)

      setdrawerBgLinearGradient()
    })
  }
})

watch(
  [() => playerStore.playState, () => route.path],
  ([newVal, newRoute], [_oldVal, oldRoute]) => {
    if (newVal) {
      audioPlayerRef.value.play()
    }
    else {
      audioPlayerRef.value.pause()
    }

    if (oldRoute && newRoute !== oldRoute) {
      lyricDrawer.value = false
    }
  },
)

// 设置抽屉背景色
function setdrawerBgLinearGradient(){
  const img = new Image()
  img.src = currentSong.value.al?.picUrl
  img.crossOrigin = 'Anonymous'
  img.onload = async() => {
    const _Colorthief = new Colorthief()

    const mainColor = await _Colorthief.getColor(img)
    // const paletteColor = await _Colorthief.getPalette(img, 3, 3)
    drawerBgLinearGradient.value = getLinearGradient(mainColor)
    const colorIndex = Math.floor(Math.random() * ColorsEnum.length)
    const color = ColorsEnum[colorIndex][0].split(',')
    sliderBarLinearGradient.value = getLinearGradient(color, 'right')
  }
}

// 音乐当前播放时间
const getCurrentTime = throttle(e => {
  currentTime.value = e.target.currentTime
  totalTime.value = e.target.duration
  sliderValue.value = (e.target.currentTime / e.target.duration) * 100
  //  播放完成后自动播放下一首
  if (currentTime.value >= totalTime.value && !isLoop.value) {
    playerStore.nextMusic()
  }
}, 1000)

// 播放、暂停
function handlePlay(){
  if (!musicUrl.value) {
    ElMessage.warning('当前无播放歌曲')
    return
  }
  playState.value = !playState.value
  if (playState.value) {
    audioPlayerRef.value.play()
  }
  else {
    audioPlayerRef.value.pause()
  }
}

// 调节时长
function handleSchedule(val){
  nextTick(() => {
    audioPlayerRef.value.currentTime = (val * totalTime.value) / 100
  })
}

// 静音
function handleMuted(){
  muted.value = !muted.value
  volumeValue.value = muted.value ? 0 : mutedBeforeVolumeValue.value
  audioPlayerRef.value.volume = volumeValue.value
}

// 调节音量
function handleVolume(val){
  muted.value = !val
  mutedBeforeVolumeValue.value = val
  audioPlayerRef.value.volume = val
}

// 下载音乐
function downloadMusic(){
  saveAs(musicUrl.value, `${currentSong.value.name}.mp3`)
}

// 查看评论详情
function handleCommentDetail(){
  if (lyricDrawer.value) {
    LyricScrollbarRef.value.scrollTo({
      top: 500,
      behavior: 'smooth',
    })
    return
  }
  router.push({
    path: `/commentDetail/${currentSong.value.id}`,
    query: { type: '0' },
  })
}

// 打开播放器抽屉
function openPlayListDraer(){
  showPlayListDrawer.value = !showPlayListDrawer.value
}

// 专辑封面显示处理
function picUrl(item){
  if (item.al) {
    return item.al.picUrl + '?param=38y38'
  }
  return item.album.artist.img1v1Url + '?param=38y38'
}

// 歌手显示处理
function singer(item){
  if (item.ar) {
    return item.ar[0].name
  }
  return item.artists[0].name
}

function handleScreenfull(){
  screenfull.toggle()
}
</script>

<style lang="scss" scoped>
@keyframes discRotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.left-box,
.content-box,
.right-box {
  flex: 1;
  flex-shrink: 0;
  height: 100%;
  display: flex;
  align-items: center;
}
.left-box {
  padding-left: 30px;
  justify-content: flex-start;
  .disc {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: url('@/assets/images/disc.png') no-repeat;
    background-size: cover;
    cursor: pointer;
    &-img {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      animation: discRotate 40s linear infinite;
      animation-play-state: paused;
    }
  }
  .song {
    max-width: 200px;
    height: 100%;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    .name-singer {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: default;
      .name {
        font-size: 16px;
        color: #ffffff;
      }
      .singer {
        font-size: 14px;
        color: #a3a3a8;
      }
    }
    .btn {
      display: flex;
      align-items: center;
      .icon-btn {
        color: #a1a1a3;
        margin-right: 5px;
        cursor: pointer;
        &:hover {
          color: #ffffff;
        }
        &:active {
          color: #858588;
        }
      }
    }
  }
}
.content-box {
  height: 100%;
  flex-direction: column;
  justify-content: center;
  .btns {
    flex: 1;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon-shangyishou,
    .icon-xiayishou,
    .icon-like,
    .icon-liebiaoxunhuan,
    .icon-danquxunhuan {
      margin: 0 10px;
      font-size: 34px;
      color: #d5d5d7;
      transition: color 0.3s;
      cursor: pointer;
      &:hover {
        color: #ffffff;
      }
      &:active {
        color: #9b9b9f;
      }
    }
    .icon-liked {
      margin: 0 10px;
      font-size: 34px;
      color: #fc3c56;
      transition: color 0.3s;
      cursor: pointer;
      &:hover {
        color: #fc3c56;
      }
      &:active {
        color: #d7253d;
      }
    }
    .play-icon {
      position: relative;
      margin: 0 10px;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #ffffff;
      transition: all 0.3s;
      .icon-bofang,
      .icon-zanting {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 40px;
        color: #fc3c56;
        border-radius: 50%;
        transition: all 0.3s;
        cursor: pointer;
        &:hover {
          color: #e3364a;
        }
      }
      &:active {
        background-color: #9b9b9f;
      }
      &:active .icon-bofang {
        color: #9a3245;
      }
      &:active .icon-zanting {
        color: #9a3245;
      }
    }
    // .icon-xiayishou {
    //   margin: 0 10px;
    //   font-size: 34px;
    //   color: #d5d5d7;
    //   transition: color 0.3s;
    //   cursor: pointer;
    //   &:hover {
    //     color: #ffffff;
    //   }
    //   &:active {
    //     color: #9b9b9f;
    //   }
    // }
  }
  .schedule {
    width: 80%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    .total-time,
    .current-time {
      font-size: 12px;
      color: #a3a3a8;
    }
    :deep(.slider) {
      margin: 0 10px;
      --el-slider-height: 3px;
      --el-slider-button-size: 8px;
      --el-slider-runway-bg-color: #4d4d56;
      --el-slider-button-wrapper-size: 10px;
      --el-slider-button-wrapper-offset: -9px;
      .el-slider__button {
        display: none;
        border: none;
      }
      .el-slider__runway {
        &:hover .el-slider__button {
          display: inline-block;
        }
      }
      .el-slider__button-wrapper.dragging {
        .el-slider__button {
          display: inline-block;
        }
      }
    }
  }
}
.right-box {
  justify-content: flex-end;
  padding-right: 30px;
  .icon-gedan {
    color: #d5d5d7;
    font-size: 40px;
    transition: color 0.3s;
    cursor: pointer;
    &:hover {
      color: #ffffff;
    }
    &:active {
      color: #9b9b9f;
    }
  }
  .volume-box {
    display: flex;
    align-items: center;
    .icon-sound,
    .icon-jingyin {
      color: #d5d5d7;
      font-size: 40px;
      transition: color 0.3s;
      cursor: pointer;
      &:hover {
        color: #ffffff;
      }
      &:active {
        color: #9b9b9f;
      }
    }
    :deep(.volume-slider) {
      min-width: 80px;
      --el-slider-height: 5px;
      --el-slider-button-size: 10px;
      --el-slider-runway-bg-color: #42424c;
      --el-slider-button-wrapper-size: 10px;
      --el-slider-button-wrapper-offset: -8px;
      --el-slider-main-bg-color: #717179;
      .el-slider__button {
        display: none;
        border: none;
      }
      .el-slider__runway {
        &:hover .el-slider__button {
          display: inline-block;
        }
      }
      .el-slider__button-wrapper.dragging {
        .el-slider__button {
          display: inline-block;
        }
      }
    }
  }
}
.footer-container {
  display: flex;
  align-items: center;
  height: 100%;
  :deep(.lyric-drawer) {
    --el-drawer-bg-color: #13131a;
    .el-drawer__header {
      margin: 0;
      padding: 0;
      height: 70px;
      box-sizing: border-box;
      .drawer-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100%;
        padding: 10px 15px;
        .btns {
          .down-btn,
          .quanping-btn {
            --el-button-text-color: #b9b9bb;
            --el-button-bg-color: transparent;
            --el-button-hover-bg-color: transparent;
            --el-button-border-color: rgba(168, 164, 166, 0.2);
            --el-button-hover-border-color: rgba(168, 164, 166, 0.3);
            border-radius: 8px;
            padding: 10px 5px;
            width: 40px;
            height: 40px;
            &:hover {
              backdrop-filter: contrast(0.9);
            }
            .icon-quanping,
            .icon-icon-quxiaoquanping {
              font-size: 30px;
            }
          }
        }
        .close-btn {
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          &:hover {
            color: #ffffff;
          }
        }
      }
    }
    .el-drawer__body {
      margin: 0;
      padding: 0 15px;
      box-sizing: border-box;
      .comment-box {
        width: 1200px;
        margin: auto;
      }
    }
    .el-drawer__footer {
      position: relative;
      margin: 0;
      padding: 0;
      height: 80px;
      box-sizing: border-box;
      .drawer-footer {
        height: 100%;
        padding: 0 15px;
        display: flex;
        align-items: center;
        backdrop-filter: blur(10px);
        .footer-slider {
          --el-slider-height: 4px;
          --el-slider-border-radius: 0px;
          --el-slider-button-size: 9px;
          --el-slider-runway-bg-color: transparent;
          --el-slider-button-wrapper-size: 10px;
          --el-slider-button-wrapper-offset: -8px;
          position: absolute;
          width: 100%;
          top: -16px;
          left: 0;
          .el-slider__button {
            display: none;
            border: none;
          }
          .el-slider__bar {
            border-bottom-right-radius: 3px;
            border-top-right-radius: 3px;
            background: var(--slider-bar-linear-gradient);
          }
          .el-slider__runway {
            &:hover .el-slider__button {
              display: inline-block;
            }
          }
          .el-slider__button-wrapper.dragging {
            .el-slider__button {
              display: inline-block;
            }
          }
        }
        .left-box {
          height: 100%;
          display: flex;
          align-items: center;
          .icon-btn {
            margin: 0 10px;
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            &:hover {
              color: #ffffff;
            }
          }
          .total-time,
          .division,
          .current-time {
            font-size: 14px;
            color: #a3a3a8;
          }
        }
      }
    }
  }
}
</style>

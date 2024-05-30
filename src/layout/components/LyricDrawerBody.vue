<template>
  <div class="lyric-drawer-body_container">
    <div class="lyric-box_wrapper">
      <div class="left-content">
        <div class="disc-wrapper">
          <el-image
            class="needle-img"
            :class="{'needle-player': playState}"
            fit="cover"
            :src="needleImage"
          />
          <div class="disc">
            <el-image
              class="disc-img"
              fit="cover"
              :src="discImage"
            />
            <el-image
              class="song-img"
              fit="cover"
              :style="{
                animationPlayState: playState ? 'running' : 'paused'
              }"
              :src="picUrl(currentSong)"
            />
          </div>
        </div>
      </div>
      <div class="right-content">
        <p class="song-name">
          {{ currentSong.name }}
        </p>
        <div class="song-info">
          <span class="album">专辑：{{ album(currentSong) }}</span>
          <span class="singer">歌手：{{ singer(currentSong) }}</span>
        </div>
        <el-scrollbar
          ref="lyricScrollbarRef"
          class="lyric-box"
          height="440"
          @mouseover="isHoverLyric = true"
          @mouseleave="isHoverLyric = false"
        >
          <p class="placeholder" />
          <p
            v-for="(item, index) in currentSong.lyric"
            :key="index"
            class="lyric-item"
            :class="{
              'lyric-item_active':
                index + 1 < currentSong.lyric.length &&
                currentTime > currentSong.lyric[index].time &&
                currentTime < currentSong.lyric[index + 1].time,
            }"
          >
            {{ item.text }}

            {{ lyricRoll(index) }}
          </p>
          <p class="placeholder" />
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'
import discImage from '@/assets/images/disc.png'
import needleImage from '@/assets/images/needle.png'
import { throttle } from '@/utils'

const playerStore = usePlayerStore()
const currentSong = computed(() => playerStore.currentSong)
const lyricScrollbarRef = ref()
const isHoverLyric = ref(false)
const playState = computed(() => playerStore.playState)
const currentTime = computed(() => playerStore.currentTime)

function lyricRoll(index){
  if (
    index + 1 < currentSong.value.lyric.length &&
    currentTime.value > currentSong.value.lyric[index].time &&
    currentTime.value < currentSong.value.lyric[index + 1].time &&
    !isHoverLyric.value
  ) {
    throttle_lyricRoll(index)
  }

  if (
    index + 1 === currentSong.value.lyric.length &&
    currentTime.value > currentSong.value.lyric[index].time &&
    !isHoverLyric.value
  ) {
    throttle_lyricRoll(currentSong.value.lyric.length)
  }
}

const throttle_lyricRoll = throttle(index => {
  nextTick(() => {
    lyricScrollbarRef.value.scrollTo({
      top: index * 40,
      behavior: 'smooth',
    })
  })
})

// 专辑封面显示处理
function picUrl(item){
  if (item.al) {
    return item.al.picUrl + '?param=200y200'
  }
  return item.album.artist.img1v1Url + '?param=200y200'
}

// 歌手显示处理
function singer(item){
  if (item.ar) {
    return item.ar[0].name
  }
  return item.artists[0].name
}

// 专辑显示处理
function album(item){
  if (item.al) {
    return item.al.name
  }
  return item.album.name
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
.lyric-drawer-body_container {
    padding: 5px 15px;
    display: flex;
    flex-direction: column;
    .lyric-box_wrapper {
        display: flex;
        align-items: center;
        height: calc(100vh - 180px);
        .left-content, .right-content {
            flex: 1;
            flex-shrink: 0;
            padding: 10px 10px;
            box-sizing: border-box;
        }
        .left-content {
            display: flex;
            padding-top: 100px;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            .disc-wrapper {
                position: relative;
                margin-left: auto;
                margin-right: 100px;
                .needle-img {
                    position: absolute;
                    margin-left: 170px;
                    top: -70px;
                    width: 130px;
                    height: 166px;
                    transform-origin: top left;
                    transform: rotateZ(-30deg);
                    transition: all 0.3s;
                    z-index: 99999;
                }

                .needle-player {
                    transform: rotateZ(0deg);
                }
                .disc {
                    width: 360px;
                    height: 360px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    .disc-img {
                        position: absolute;
                        width: 340px;
                        height: 340px;
                        border-radius: 50%;
                    }
                    .song-img {
                        position: absolute;
                        width: 200px;
                        height: 200px;
                        border-radius: 50%;
                        animation: discRotate 40s linear infinite;
                        animation-play-state: paused;
                    }
                }
            }
        }
        .right-content {
            .song-name {
                font-size: 22px;
                color: #ffffff;
                font-weight: 500;
                margin-top: 0;
                margin-bottom: 10px;
            }
            .song-info {
                display: flex;
                align-items: center;
                font-size: 14px;
                color: #9a9090;
                margin-bottom: 10px;
                .album, .singer {
                    margin-right: 20px;
                }
            }
            .lyric-box {
                width: 600px;
                height: 440px;
                mask-image: linear-gradient(0deg, transparent, #fff 30%, #fff 60%, transparent);
                .placeholder {
                    margin: 0;
                    padding: 100px 0;
                }
                .lyric-item {
                    height: 40px;
                    color: #9a9090;
                    font-size: 14px;
                    word-break: break-all;
                    margin:0;
                    transition: all 0.3s;
                }
                .lyric-item_active {
                    color: #ffffff;
                    font-size: 18px;
                    font-weight: 500;
                }
            }
        }
    }
}
</style>

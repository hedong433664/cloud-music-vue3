<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="album-Detail_container layout-content">
    <div class="header">
      <div class="cover">
        <el-image :src="albumInfo.blurPicUrl" />
      </div>

      <div class="info">
        <div class="up-box">
          <p class="playlist-title">
            {{ albumInfo.name }}
          </p>
          <div class="creator">
            <el-image :src="albumInfo.artist?.picUrl" />
            <span class="author" @click="handleUserInfo(albumInfo.artist?.id)">
              {{ albumInfo.artist?.name }}</span>
            <span class="created-time">{{ dayjs(albumInfo.publishTime).format('YYYY-MM-DD') }}发布</span>
          </div>
        </div>

        <div class="down-box">
          <el-button class="play-all-btn" type="primary" @click="playAll()">
            <i class="iconfont icon-bofang-solid" />
            播放全部
          </el-button>
        </div>
      </div>
    </div>

    <div class="content">
      <el-tabs v-model="activeName">
        <el-tab-pane label="歌曲" name="playlist" lazy>
          <song-table :song-list="songList" />
        </el-tab-pane>
        <el-tab-pane label="评论" name="review" lazy>
          <Comment :id="route.params.id" type="2" target-type="2" />
        </el-tab-pane>
        <el-tab-pane label="专辑详情" name="description" lazy>
          <div class="description" v-html="albumInfo.description" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import dayjs from 'dayjs'
import { setBackground } from '@/utils'
import { getAlbumInfoApi } from '@/api'
import Colorthief from 'colorthief'
import useLoading from '@/hooks/useLoading'

const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()
const albumInfo = ref({})
const songList = ref([])
const activeName = ref('playlist')

// 获取歌单详情
async function getalbumInfo(){
  const { startLoading, stopLoading } = useLoading()

  try {
    startLoading()
    const { album, songs } = await getAlbumInfoApi({ id: route.params.id })
    albumInfo.value = album
    songList.value = songs
    // 将/n处理换行
    albumInfo.value.description = albumInfo.value.description.replace(/\n/g, '<br/>')
    const img = new Image()
    img.src = album.blurPicUrl
    img.crossOrigin = 'Anonymous'
    img.onload = async() => {
      const _Colorthief = new Colorthief()

      const mainColor = await _Colorthief.getColor(img)
      setBackground(mainColor)
      document.documentElement.style.setProperty('--body-before-opacity', 1)
    }
  }
  finally {
    stopLoading()
  }
}

function playAll(){
  playerStore.playAll(albumInfo.value.tracks)
}

function handleUserInfo(id){
  router.push(`/userInfo/${id}`)
}

onMounted(() => {
  getalbumInfo()
})
</script>

<style lang="scss" scoped>
.album-Detail_container {
  .header {
    width: 100%;
    height: 180px;
    display: flex;
    align-items: center;
    .cover {
      position: relative;
      width: 150px;
      height: 150px;
      border-radius: 5px;
      margin: 15px 15px 15px 0;
      flex-shrink: 0;
      .el-image {
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
      &::before {
        content: '';
        position: absolute;
        width: 140px;
        height: 10px;
        left: 50%;
        top: -5px;
        transform: translate(-50%);
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 5px;
      }
    }
    .info {
      height: 100%;
      padding: 15px 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .up-box {
        .playlist-title {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: bold;
        }
        .playlist-desc {
          margin: 0 0 8px 0;
        }
        .creator {
          display: flex;
          align-items: center;
          .el-image {
            width: 20px;
            height: 20px;
            border-radius: 50%;
          }
          .author {
            color: #5e7cbd;
            font-size: 12px;
            margin: 0 10px;
            cursor: pointer;
            &:hover {
              text-decoration: underline;
              color: #5e7cbd;
            }
          }
          .created-time {
            margin: 0 10px;
            font-size: 12px;
            color: #beb4ad;
          }
        }
      }
      .down-box {
        display: flex;
        align-items: center;
        .play-all-btn {
          height: 36px;
          padding: 12px 8px;
          font-size: 12px;
        }
      }
    }
  }
  .content {
    :deep(.el-tabs__content) {
      overflow: visible;
    }
    .description {
      padding: 15px;
      font-size: 14px;
      color: #a1a1a3;
      line-height: 20px;
      word-break: break-all;
    }
  }
}
</style>

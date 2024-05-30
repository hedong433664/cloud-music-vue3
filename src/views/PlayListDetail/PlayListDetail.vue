<template>
  <div class="playlist-detail_container layout-content">
    <div class="header">
      <div class="cover">
        <el-image :src="playlistDetail.coverImgUrl" />
        <div class="play-counts">
          <i class="iconfont icon-bofang-solid" />
          <span class="counts">
            {{ formatCount(playlistDetail.playCount) }}
          </span>
        </div>
      </div>

      <div class="info">
        <div class="up-box">
          <p class="playlist-title">
            {{ playlistDetail.name }}
          </p>
          <p class="playlist-desc">
            <el-text line-clamp="2">
              {{ playlistDetail.description }}
            </el-text>
          </p>
          <div class="creator">
            <el-image :src="playlistDetail.creator?.avatarUrl" />
            <span class="author" @click="handleUserInfo(playlistDetail.creator?.userId)">{{
              playlistDetail.creator?.nickname
            }}</span>
            <span class="tags">标签：{{ playlistDetail.algTags?.join('/') || '--' }}</span>
            <span class="created-time">{{ dayjs(playlistDetail.createTime).format('YYYY-MM-DD') }}创建</span>
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
          <SearchTable ref="SearchTableRef" v-model:offset="offset" v-model:limit="limit" :request="getPlaylist" />
        </el-tab-pane>
        <el-tab-pane label="评论" name="review" lazy>
          <Comment :id="route.params.id" type="2" target-type="1" />
        </el-tab-pane>
        <el-tab-pane label="收藏者" name="collector" lazy>
          <Collector />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import Collector from './components/Collector.vue'
import dayjs from 'dayjs'
import { formatCount, setBackground } from '@/utils'
import { getPlaylistDetailApi, getPlaylistTrackAllApi } from '@/api'
import Colorthief from 'colorthief'
import useLoading from '@/hooks/useLoading'

const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()
const playlistDetail = ref({})
const total = ref(0)
const offset = ref(0)
const limit = ref(30)
const activeName = ref('playlist')

// 获取歌单详情
async function getPlaylistDetail(){
  const { startLoading, stopLoading } = useLoading()

  try {
    startLoading()
    const { playlist } = await getPlaylistDetailApi({ id: route.params.id })
    playlistDetail.value = playlist
    total.value = playlist.trackCount
    const img = new Image()
    img.src = playlistDetail.value.coverImgUrl
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

// 分页查询歌单歌曲
async function getPlaylist(){
  const { songs } = await getPlaylistTrackAllApi({
    id: route.params.id,
    limit: limit.value,
    offset: offset.value,
  })
  return {
    content: songs,
    totalElements: total.value,
  }
}

function playAll(){
  playerStore.playAll(playlistDetail.value.tracks)
}

function handleUserInfo(id){
  router.push(`/userInfo/${id}`)
}

onMounted(() => {
  getPlaylistDetail()
})
</script>

<style lang="scss" scoped>
.playlist-detail_container {
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
      .play-counts {
        position: absolute;
        top: 5px;
        right: 5px;
        display: flex;
        align-items: center;
        z-index: 3;
        .counts {
          font-size: 12px;
          color: #ffffff;
          font-weight: bold;
        }
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
          .tags,
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
  }
}
</style>

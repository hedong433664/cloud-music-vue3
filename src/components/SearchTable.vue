<template>
  <div class="search-table_wrapper">
    <div class="table-box">
      <div v-if="showHeader" class="tabel-header">
        <span class="index">#</span>
        <span class="name">标题</span>
        <span v-if="showAlbum" class="album">专辑</span>
        <span class="time">时长</span>
      </div>

      <ContextMenu :menu="menuList">
        <div class="table-body">
          <div
            v-for="(item, index) in tabelData"
            :key="item.id"
            class="row-box"
            @dblclick="playSong(item)"
            @contextmenu="handleRowContextmenu(item)"
          >
            <div class="index">
              <PlayerIcon v-show="playState && currentSong.id === item.id" class="player-icon" />

              <span v-show="!playState || currentSong.id !== item.id">{{ index + 1 + offset * limit }}</span>
            </div>
            <i class="iconfont icon-bofang-solid" @click="playSong(item)" />
            <div class="song">
              <el-image class="song-img" :lazy="isSongImgLazy" :src="picUrl(item)" />
              <div class="name">
                <span
                  class="song-name"
                  :style="{ color: item.id === currentSong.id ? '#ff3a3a' : '' }"
                  :title="item.name"
                >{{ item.name }}</span>
                <span class="singer">{{ singer(item) }}</span>
              </div>
            </div>
            <span v-if="showAlbum" class="album">{{ album(item) }}</span>
            <span class="time">{{ formatMillisecond(item.dt || item.duration) }}</span>
          </div>
        </div>
      </ContextMenu>
    </div>

    <div v-if="total > limit" class="pagination-box">
      <Pagination
        :total="total"
        :page-size="limit"
        @change="paginationChange"
      />
    </div>
  </div>
</template>

<script setup>
import { formatMillisecond } from '@/utils'
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/playerStore'
import { getMusicUrlApi } from '@/api'
import { saveAs } from 'file-saver'
import { ElMessage } from 'element-plus'
import useLoading from '@/hooks/useLoading'
const props = defineProps({
  showHeader: {
    type: Boolean,
    default: true,
  },
  showAlbum: {
    type: Boolean,
    default: true,
  },
  isSongImgLazy: {
    type: Boolean,
    default: true,
  },
  data: {
    type: Array,
    default: () => [],
  },
  offset: {
    type: Number,
    default: 0,
  },
  limit: {
    type: Number,
    default: 30,
  },
  request: {
    type: Function,
    default: () => ({}),
  },
})
const emits = defineEmits(['play-song', 'update:offset', 'update:limit'])
const playerStore = usePlayerStore()
const router = useRouter()

const playState = computed(() => playerStore.playState)
const currentSong = computed(() => playerStore.currentSong)
const selectRow = ref({})
const tabelData = ref([])
const total = ref(0)
const menuList = ref([
  {
    label: '播放',
    icon: 'icon-bofang-plain',
    onClick: () => {
      playSong(selectRow.value, false)
    },
  },
  {
    label: '下一首播放',
    icon: 'icon-xiayishou-plain',
    onClick: () => {
      playerStore.addMusic(selectRow.value, true)
    },
  },
  {
    label: '添加到播放列表',
    icon: 'icon-gedan',
    onClick: () => {
      playerStore.addMusic(selectRow.value)
    },
  },
  {
    label: '查看评论',
    icon: 'icon-gengduo',
    onClick: handleComment,
  },
  {
    label: '复制链接',
    icon: 'icon-copy',
    onClick: handleCopy,
  },
  {
    label: '下载',
    icon: 'icon-xiazai',
    onClick: handleDownloadMusic,
  },
])

// 播放音乐
function playSong(item, flag = true){
  playerStore.getSong(item, flag)
  emits('play-song', item, flag)
}

// 右键菜单点击某一列
function handleRowContextmenu(item){
  selectRow.value = item
}

// 查看评论
function handleComment(){
  router.push({
    path: `/commentDetail/${selectRow.value.id}`,
    query: { type: '0' },
  })
}

// 下载音乐
async function handleDownloadMusic(){
  const { data } = await getMusicUrlApi({ id: selectRow.value.id })

  saveAs(data[0].url, `${selectRow.value.name}.mp3`)
}

// 复制链接
async function handleCopy(){
  const { data } = await getMusicUrlApi({ id: selectRow.value.id })

  navigator.clipboard.writeText(data[0].url)
  ElMessage.success('复制成功')
}

// 专辑封面显示处理
function picUrl(item){
  if (item.al) {
    return item.al.picUrl + '?param=35y35'
  }
  return item.album.artist.img1v1Url + '?param=35y35'
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

// 分页
function paginationChange(page, size){
  emits('update:offset', page - 1)
  emits('update:limit', size)
  console.log(page, size)
  handleSearch()
}

// 搜索
async function handleSearch(){
  const { startLoading, stopLoading } = useLoading()
  try {
    startLoading()
    const { content, totalElements } = await props.request()

    tabelData.value = content || []
    total.value = totalElements || 0
  }

  finally {
    stopLoading()
  }
}

defineExpose({ handleSearch })

onMounted(() => {
  if (typeof props.request === 'function') {
    handleSearch()
  }
  else {
    tabelData.value = props.data
  }
})
</script>

<style lang="scss" scoped>
.search-table_wrapper {
  display: flex;
  flex-direction: column;
  min-height: 300px;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  padding: 5px 10px 5px 5px;
  box-sizing: border-box;
  .table-box {
    width: 100%;
    .tabel-header {
      width: 100%;
      height: 30px;
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #a1a1a3;
      cursor: default;
      user-select: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      .index {
        width: 50px;
        text-align: center;
      }
      .name {
        flex: 1;
      }
      .album {
        width: 35%;
      }
      .time {
        width: 100px;
        text-align: center;
      }
    }
    .table-body {
      width: 100%;
      height: calc(100% - 30px);
      .row-box {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        font-size: 14px;
        border-radius: 10px;
        transition: all 0.3s;
        cursor: pointer;
        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        &:hover .index {
          display: none;
        }
        &:hover .icon-bofang-solid {
          display: block;
        }
        .index {
          width: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #838387;
        }
        .icon-bofang-solid {
          display: none;
          width: 50px;
          font-size: 20px;
          text-align: center;
          color: #838387;
          transition: all 0.3s;
          &:hover {
            transform: scale(1.2);
            color: #ffffff;
          }
        }
        .song {
          flex: 1;
          color: #ffffff;
          display: flex;
          align-items: center;
          .song-img {
            flex-shrink: 0;
            width: 35px;
            height: 35px;
            border-radius: 3px;
            margin-right: 10px;
          }
          .name {
            flex: 1;
            display: flex;
            flex-direction: column;
            .song-name {
              max-width: 150px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .singer {
              font-size: 12px;
              color: #9d9da0;
            }
          }
        }
        .album {
          width: 35%;
          color: #c1c1c6;
        }
        .time {
          width: 100px;
          color: #838387;
          text-align: center;
        }
      }
    }
  }
  .pagination-box {
    margin-top: 20px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

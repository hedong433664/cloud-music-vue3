<template>
  <div class="recommend_wrapper layout-content">
    <div class="banner">
      <el-carousel :interval="4000" type="card" height="200px">
        <el-carousel-item v-for="item in banners" :key="item.targetId">
          <el-image
            style="width: 100%; height: 220px; border-radius: 10px"
            :src="item.imageUrl"
            lazy
          />
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="recommend-playlist">
      <div class="title">
        推荐歌单
      </div>

      <el-row :gutter="30">
        <el-col
          v-for="item in personalizedPlaylist"
          :key="item.id"
          :span="4"
        >
          <CardItem
            :cover-url="item.picUrl"
            :play-count="item.playCount"
            :name="item.name"
            @click="handlePlaylistClick(item)"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { setBackground } from '@/utils/index.js'
import { getBannerApi, getPersonalizedApi } from '@/api'
import useLoading from '@/hooks/useLoading'

const router = useRouter()
const banners = ref([])
const personalizedPlaylist = ref([])
// 获取轮播图
async function getBanner(){
  const res = await getBannerApi()
  banners.value = res.banners
}

// 获取推荐歌单
async function getPersonalizedPlaylist(){
  const { result } = await getPersonalizedApi()
  personalizedPlaylist.value = result
}

// 点击歌单
function handlePlaylistClick(item){
  router.push(`/playlistDetail/${item.id}`)
}

onMounted(() => {
  const { startLoading, stopLoading } = useLoading()
  startLoading()
  Promise.all([getBanner(), getPersonalizedPlaylist()]).then(stopLoading)
  setBackground()
})
</script>

<style lang="scss" scoped>
.recommend_wrapper {
  .banner {
    .el-carousel__item {
      border-radius: 10px;
    }
  }
  .recommend-playlist {
    margin-top: 20px;
    .title {
      width: fit-content;
      display: flex;
      align-items: center;
      height: 20px;
      font-size: 18px;
      line-height: 20px;
      margin-bottom: 20px;
    }
  }
}
</style>

<template>
  <div class="user-info_container layout-content">
    <div class="user-box">
      <el-image
        class="avatar"
        :src="userInfo.profile.avatarUrl"
      />

      <div class="right-box">
        <h3 class="nickname">
          {{ userInfo.profile.nickname }}
        </h3>
        <div class="level-gender">
          <span class="level">
            LV.{{ userInfo.level }}
          </span>
          <el-icon v-if="userInfo.profile.gender === 1" color="#32a9fc">
            <Male />
          </el-icon>
          <el-icon v-else color="#fca7ea">
            <Female />
          </el-icon>
        </div>

        <div class="attention-fans">
          <span class="item">关注 {{ userInfo.profile.follows }}</span>
          <span class="item">粉丝 {{ userInfo.profile.followeds }}</span>
        </div>

        <div class="signature">
          简介：{{ userInfo.profile.signature }}
        </div>
      </div>
    </div>

    <el-tabs v-model="activeName" class="tabs-view">
      <el-tab-pane lazy label="歌单" name="playlist">
        <el-row :gutter="30">
          <el-col
            v-for="item in userPlayList"
            :key="item.id"
            :span="4"
          >
            <CardItem
              :cover-url="item.coverImgUrl"
              :play-count="item.playCount"
              :name="item.name"
              @click="handlePlaylistClick(item)"
            />
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Male, Female } from '@element-plus/icons-vue'
import { getUserDetailApi, getUserPlayListApi } from '@/api'
import { setBackground } from '@/utils'
import Colorthief from 'colorthief'
import useLoading from '@/hooks/useLoading'

const route = useRoute()
const router = useRouter()
const userInfo = ref({ profile: {}})
const userPlayList = ref([])
const activeName = ref('playlist')
watch(() => route.params.uid, () => {
  getUserDetail(route.params.uid)
}, { immediate: true })

// 获取用户歌单
async function getUserPlayList(uid){
  const res = await getUserPlayListApi({ uid })
  userPlayList.value = res.playlist
}

async function getUserDetail(uid){
  const { startLoading, stopLoading } = useLoading()
  try {
    startLoading()
    const res = await getUserDetailApi({ uid })
    userInfo.value = res
    getUserPlayList(uid)
    const img = new Image()
    img.src = res.profile.avatarUrl
    img.crossOrigin = 'Anonymous'
    img.onload = async() => {
      const _Colorthief = new Colorthief()

      const mainColor = await _Colorthief.getColor(img)
      setBackground(mainColor)
      document.documentElement.style.setProperty('--body-before-opacity', 1)
    }
  }
  catch (error) {
    router.back()
  }
  finally {
    stopLoading()
  }
}

// 点击歌单
function handlePlaylistClick(item){
  router.push(`/playlistDetail/${item.id}`)
}
</script>

<style lang="scss" scoped>
.user-info_container {
    display: flex;
    flex-direction: column;
    .user-box {
        display: flex;
        align-items: center;
        height: 140px;
        .avatar {
            width: 140px;
            height: 140px;
            border-radius: 50%;
            margin-right: 20px;
        }
        .right-box {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            .nickname {
                margin: 0;
                color: #ffffff;
            }
            .level-gender {
                display: flex;
                align-items: center;
                .level {
                    display: inline-block;
                    width: fit-content;
                    height: 20px;
                    line-height: 20px;
                    padding: 0 5px;
                    text-align: center;
                    border: 1px solid #646464;
                    color: #ffffff;
                    font-size: 12px;
                    border-radius: 20px;
                    margin-right: 20px;
                }
            }
            .attention-fans {
                display: flex;
                font-size: 14px;
                .item {
                    margin-right: 20px;
                }
            }
            .signature {
                font-size: 14px;
                color: #d0d0d1;
                max-width: 500px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis
            }
        }
    }
    .playlist {
      .playlist-item {
        position: relative;
        width: 175px;
        height: 225px;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 30px;
        cursor: pointer;
        &_img {
          width: 175px;
          height: 175px;
          border-radius: 10px;
        }
        &_name {
          color: #ffffff;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
}
</style>

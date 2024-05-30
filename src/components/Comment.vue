<template>
  <div class="comment-container">
    <div v-if="showTarget" class="target-box">
      <div class="cover">
        <el-image :src="targetContent.cover" />
      </div>

      <div class="info">
        <div class="title">
          <span class="tag">
            {{ targetType === '0' ? '歌曲' : '歌单' }}
          </span>
          {{ targetContent.title }}
        </div>
        <div class="artist">
          专辑：{{ targetContent.album }}
          歌手：{{ targetContent.singer }}
        </div>
      </div>
    </div>

    <h3> 全部评论（{{ commentsTotal }}）</h3>
    <div class="input-box">
      <el-input
        ref="commentInput"
        v-model="context"
        type="textarea"
        show-word-limit
        :maxlength="140"
        :autosize="{ minRows: 4, maxRows: 4 }"
        placeholder="说点什么吧"
      />

      <div class="save-btn" @click="handleSave">
        发布
      </div>
    </div>

    <div v-if="hotComments.length > 0" class="comment-box">
      <h3>精彩评论</h3>
      <div v-for="item in hotComments" :key="item.commentId" class="comment-item">
        <div class="user-avatar">
          <el-avatar :size="40" :src="item.user.avatarUrl" />
        </div>
        <div class="comment-content">
          <span class="nickname" @click="handleUserInfo(item.user.userId)">
            {{ item.user.nickname }}
          </span>
          <div class="comment-text">
            {{ item.content }}
          </div>
          <div v-for="children in item.children" :key="children.commentId" class="children">
            <span class="nickname" @click="handleUserInfo(children.user.userId)">
              {{ `@${children.user.nickname}` }}
            </span>
            <div class="children-comment-text">
              ：{{ children.content }}
            </div>
          </div>
          <div class="comment-bottom">
            <span class="time">{{ item.timeStr }}</span>

            <div class="btns">
              <div class="liked">
                <span class="likedCount">
                  {{ formatCount(item.likedCount) }}
                </span>
                <i
                  class="iconfont icon-dianzan"
                  :class="{ active: item.liked }"
                  @click="handleLike(item)"
                />
              </div>
              <div class="evaluate">
                <i class="iconfont icon-gengduo" @click="handleAtUser(item)" />
                <el-icon
                  v-if="userInfo.userId === item.user.userId"
                  size="16"
                  @click="handleDel(item)"
                >
                  <Delete />
                </el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="comments.length > 0" class="comment-box">
      <h3>最新评论</h3>
      <div v-for="item in comments" :key="item.commentId" class="comment-item">
        <div class="user-avatar">
          <el-avatar :size="40" :src="item.user.avatarUrl" />
        </div>
        <div class="comment-content">
          <span class="nickname" @click="handleUserInfo(item.user.userId)">
            {{ item.user.nickname }}
          </span>
          <div class="comment-text">
            {{ item.content }}
          </div>
          <div v-for="children in item.children" :key="children.commentId" class="children">
            <span class="nickname" @click="handleUserInfo(children.user.userId)">
              {{ `@${children.user.nickname}` }}
            </span>
            <div class="children-comment-text">
              ：{{ children.content }}
            </div>
          </div>
          <div class="comment-bottom">
            <span class="time">{{ item.timeStr }}</span>

            <div class="btns">
              <div class="liked">
                <span class="likedCount" :class="{ active: item.liked }">
                  {{ formatCount(item.likedCount) }}
                </span>
                <i
                  class="iconfont icon-dianzan"
                  :class="{ active: item.liked }"
                  @click="handleLike(item)"
                />
              </div>
              <div class="evaluate">
                <i class="iconfont icon-gengduo" @click="handleAtUser(item)" />
                <el-icon
                  v-if="userInfo.userId === item.user.userId"
                  size="16"
                  @click="handleDel(item)"
                >
                  <Delete />
                </el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-empty v-if="hotComments.length === 0 && comments.length === 0" description="暂无评论" />
  </div>
</template>

<script setup>
import { ref, computed, watch, inject } from 'vue'
import {
  getMusicCommentApi,
  getPlaylistCommentApi,
  getAlbumCommentApi,
  getSongDetailApi,
  getPlaylistDetailApi,
  getAlbumDetailApi,
  commentLikeApi,
  saveOrDelCommentApi,
} from '@/api'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import useLoading from '@/hooks/useLoading'
import { useUserStore } from '@/stores/userStore'
import { formatCount } from '@/utils'

const props = defineProps({
  id: {
    type: [Number, String],
    default: null,
  },
  targetType: {
    type: [Number, String],
    default: '0', // 0: 歌曲 1: 歌单 2: 专辑 3: MV 4: 视频
  },
  type: {
    type: [Number, String],
    default: '0',
  },
  showTarget: {
    type: Boolean,
    default: false,
  },
  showLoading: {
    type: Boolean,
    default: true,
  },
})
const LayoutScrollbar = inject('LayoutScrollbar')
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo.data)
const router = useRouter()
const commentInput = ref(null)
const targetContent = ref({})
const commentsTotal = ref(0)
const context = ref('') // 评论内容
const hotComments = ref([]) // 热门评论
const comments = ref([]) // 最新评论
const atUserName = ref('') // 当前@人名
const atCommentId = ref('') // 当前评论id
// 获取目标详情
async function getTarget(){
  const { startLoading, stopLoading } = useLoading()
  try {
    if (props.showLoading) {
      startLoading()
    }
    if (props.targetType === '0') {
      const res = await getSongDetailApi({ ids: props.id })

      targetContent.value = {
        cover: res.songs[0].al.picUrl,
        title: res.songs[0].name,
        singer: res.songs[0].ar[0].name,
        album: res.songs[0].al.name,
      }
    }
    else if (props.targetType === '1') {
      const res = await getPlaylistDetailApi({ id: props.id })

      targetContent.value = {
        cover: res.songs[0].al.picUrl,
        title: res.songs[0].name,
        artist: res.songs[0].ar[0].name,
      }
    }
    else {
      const res = await getAlbumDetailApi({ id: props.id })

      targetContent.value = {
        cover: res.songs[0].al.picUrl,
        title: res.songs[0].name,
        artist: res.songs[0].ar[0].name,
      }
    }
  }
  catch (error) {
    console.log(error)
  }
  finally {
    if (props.showLoading) {
      stopLoading()
    }
  }
}
// 获取评论
async function getComment(){
  const { startLoading, stopLoading } = useLoading()
  try {
    if (props.showLoading) {
      startLoading()
    }
    let api = null
    if (props.targetType === '0') {
      api = getMusicCommentApi
    }
    else if (props.targetType === '1') {
      api = getPlaylistCommentApi
    }
    else {
      api = getAlbumCommentApi
    }
    const res = await api({
      id: props.id,
      limit: 30,
      offset: 0,
    })
    const hotCommentsData = res.hotComments.map(item => ({
      ...item,
      children: [],
    }))
    const commentsData = res.comments.map(item => ({
      ...item,
      children: [],
    }))
    // 将评论树型结构
    handleTree(hotCommentsData, 0)
    handleTree(commentsData, 0)
    hotComments.value = hotCommentsData.filter(item => item.beReplied.length === 0)
    comments.value = commentsData.filter(item => item.beReplied.length === 0)
    commentsTotal.value = res.total
  }
  catch (error) {
    console.log(error)
  }
  finally {
    if (props.showLoading) {
      stopLoading()
    }
  }
}

// 递归处理树型结构
function handleTree(data, parentId){
  data.forEach(item => {
    if (item.parentCommentId === parentId) {
      const newItem = {
        ...item,
        children: [],
      }
      handleTree(data, item.commentId)
      if (newItem.children.length > 0) {
        newItem.children = newItem.children.map(child => ({
          ...child,
          children: [],
        }))
      }
      const parentItem = data.find(i => i.commentId === parentId)
      if (parentItem) {
        parentItem.children.push(newItem)
      }
    }
  })
}

// @用户进行评论
function handleAtUser({ user, commentId }){
  atCommentId.value = commentId
  atUserName.value = `回复 ${user.nickname}： `
  context.value = `回复 ${user.nickname}： `
  commentInput.value.focus()
  LayoutScrollbar.value.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

// 删除评论
async function handleDel(item){
  const params = {
    id: props.id,
    commentId: item.commentId,
    t: '0',
    type: props.type,
  }
  await saveOrDelCommentApi(params)
  ElMessage.success('删除成功')
  getComment()
}
// 发布评论
async function handleSave(){
  const params = {
    id: props.id,
    t: '1',
    type: props.type,
    content: context.value,
  }
  if (atCommentId.value && atUserName.value) {
    params.commentId = atCommentId.value
    params.t = '2'
    params.content = params.content.replace(atUserName.value, '')
  }
  if (params.content.length === 0) {
    ElMessage.error('评论内容不能为空')
    return
  }
  await saveOrDelCommentApi(params)
  ElMessage.success('发布成功')
  getComment()
  atCommentId.value = ''
  atUserName.value = ''
  context.value = ''
}

function handleUserInfo(userId){
  router.push(`/userInfo/${userId}`)
}

// 评论点赞
async function handleLike(item){
  const params = {
    id: props.id,
    cid: item.commentId,
    t: item.liked ? 0 : 1,
    type: props.type,
  }
  await commentLikeApi(params)
  if (item.liked) {
    ElMessage.info('取消点赞')
  }
  else {
    ElMessage.success('点赞成功')
  }
  getComment()
}
watch(() => props.id, newVal => {
  if (props.showTarget) {
    getTarget()
  }
  if (newVal) {
    getComment()
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.comment-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  .target-box {
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    padding: 5px;
    margin-bottom: 10px;
    .cover {
      position: relative;
      width: 80px;
      height: 80px;
      border-radius: 5px;
      flex-shrink: 0;
      .el-image {
        width: 100%;
        height: 100%;
        border-radius: 5px;
      }
      &::before {
        content: '';
        position: absolute;
        width: 70px;
        height: 10px;
        left: 50%;
        top: -5px;
        transform: translate(-50%);
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 5px;
      }
    }
    .info {
      height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      margin-left: 10px;
      .title {
        display: flex;
        height: 30px;
        line-height: 30px;
        align-items: center;
        font-size: 18px;
        font-weight: bold;
        color: #ffffff;
        .tag {
          display: block;
          width: fit-content;
          height: 16px;
          line-height: 16px;
          padding: 0 5px;
          color: #f03a3a;
          border: 1px solid #f03a3a;
          border-radius: 10px;
          font-size: 12px;
          margin-right: 2px;
          font-weight: 400;
        }
      }
      .artist {
        font-size: 12px;
        color: #a1a1a3;
      }
    }
  }
  .input-box {
    position: relative;
    margin-bottom: 10px;
    :deep(.el-textarea) {
      --el-input-focus-border-color: #a1a8b6;
      .el-input__count {
        left: 10px;
      }
    }
    .save-btn {
      position: absolute;
      right: 10px;
      bottom: 10px;
      color: #a3a3a6;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      &:hover {
        color: #ffffff;
      }
      &:active {
        color: #a3a3a6;
      }
    }
  }
  .comment-box {
    margin-bottom: 10px;
    .comment-item {
      display: flex;
      align-items: flex-start;
      padding: 10px;
      border-bottom: 1px solid #2b2b31;
      .user-avatar {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
      .comment-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        .nickname {
          width: fit-content;
          font-size: 14px;
          color: #5e7cbd;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
            color: #5e7cbd;
          }
        }
        .comment-text {
          color: #e8e8e9;
          font-size: 14px;
          margin: 10px 0;
        }
        .children {
          border-left: 1px solid #2b2b31;
          padding-left: 10px;
          margin: 10px 0;
          line-height: 20px;
          .children-comment-text {
            display: inline;
            color: #a1a1a3;
            font-size: 14px;
          }
        }
        .comment-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .time {
            margin-right: 10px;
            font-size: 12px;
            color: #a1a1a3;
          }
          .btns {
            display: flex;
            align-items: center;
            .liked,
            .evaluate {
              display: flex;
              align-items: center;
              .likedCount {
                font-size: 12px;
                color: #a1a1a3;
              }
              .active {
                color: #ff3a3a;
              }
              i {
                font-size: 30px;
                color: #a1a1a3;
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
      }
    }
  }
}
</style>

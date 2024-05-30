<template>
  <div class="personal-center_container">
    <el-avatar :size="30" :src="isLogin ? userInfo.avatarUrl : userIcon" @click="userClick" />
    <el-dropdown v-if="isLogin" trigger="click" @command="handleCommand">
      <span class="user-name">
        {{ userInfo.nickname }}
        <el-icon>
          <ArrowDown />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="userInfo">
            个人中心
          </el-dropdown-item>
          <el-dropdown-item command="logout">
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <span v-else class="user-name">点击头像登录</span>

    <el-dialog
      v-model="dialogVisible"
      title="扫码登录"
      width="500"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :center="true"
    >
      <div class="qr-code">
        <el-image :src="qrCode" />
        <div v-show="qrScanStatus === 800" class="mask">
          二维码不存在或已过期
        </div>
        <p>{{ qrScanMessage }}</p>
        <el-button v-show="qrScanStatus === 800" type="primary" @click="getQrCodeKey">
          刷 新
        </el-button>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">
            取 消
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import userIcon from '@/assets/images/user.png'
import { ArrowDown } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/userStore'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getQrKeyApi, getQrBase64Api, getQrScanStatusApi } from '@/api'

const router = useRouter()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo.data)
const isLogin = computed(() => userStore.userInfo.isLogin)
const dialogVisible = ref(false)
const qrCode = ref(null)
const qrCodeKey = ref(null)
const qrScanStatus = ref(801)
const qrScanMessage = ref(null)
const timer = ref(null)

function handleClose(){
  dialogVisible.value = false
  clearTimer()
}

function userClick(){
  if (isLogin.value) {
    router.push(`/userInfo/${userInfo.value.userId}`)
    return
  }
  if (qrCodeKey.value) {
    getQrCodeBase64()
  }
  else {
    getQrCodeKey()
  }
  dialogVisible.value = true
}

// 获取二维码key
async function getQrCodeKey(){
  const { data } = await getQrKeyApi({ timestamp: Date.now() })
  qrCodeKey.value = data.unikey
  getQrCodeBase64()
}

// 通过二维码key获取base64
async function getQrCodeBase64(){
  const { data } = await getQrBase64Api({
    key: qrCodeKey.value,
    qrimg: true,
    timestamp: Date.now(),
  })
  qrCode.value = data.qrimg

  // 轮询二维码扫描状态
  timer.value = setInterval(getQrCodeStatus, 1500)
}

// 清除定时器
function clearTimer(){
  clearInterval(timer.value)
  timer.value = null
}

// 获取二维码扫描状态
async function getQrCodeStatus(){
  const data = await getQrScanStatusApi({
    key: qrCodeKey.value,
    nocookie: true,
    timestamp: Date.now(),
  })
  qrScanMessage.value = data.message
  qrScanStatus.value = data.code
  if (data.code === 800) {
    // 二维码已失效
    clearTimer()
  }
  if (data.code === 803) {
    // 确认登录
    userStore.SET_COOKIE(data.cookie)
    userStore.getLoginStatus()
    dialogVisible.value = false
    qrCode.value = null
    qrCodeKey.value = null
    qrScanStatus.value = 801
    qrScanMessage.value = null
    clearTimer()
  }
}

// 下拉选择
function handleCommand(command){
  if (command === 'userInfo') {
    router.push(`/userInfo/${userInfo.value.userId}`)
  }
  else if (command === 'logout') {
    userStore.LOGOUT()
  }
}

</script>

<style lang="scss" scoped>
.personal-center_container {
    margin-left: auto;
    display: flex;
    align-items: center;
    cursor: pointer;
    .el-avatar {
        --el-avatar-bg-color: transparent;
    }
    .user-name {
        margin-left: 10px;
        color: #b9b9bb;
        font-size: 14px;
    }
    .qr-code {
      position: relative;
      margin: auto;
      width: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 200px;
        background: rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
      }
      p {
        margin-top: 10px;
        color: #b9b9bb;
        font-size: 14px;
      }
      .el-image {
        width: 100%;
        height: 200px;
      }
    }
}
</style>

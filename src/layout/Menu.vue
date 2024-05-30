<template>
  <div class="menu-container">
    <el-menu
      :default-active="defaultActivePath"
      background-color="#27272e"
      text-color="#d1d1d3"
      active-text-color="#ffffff"
      router
    >
      <el-menu-item index="/recommend">
        为我推荐
      </el-menu-item>
      <!-- <el-menu-item index="/podcast">
        播客
      </el-menu-item>
      <el-menu-item index="/recommendVideo">
        视频
      </el-menu-item>
      <el-menu-item index="/myFollow">
        关注
      </el-menu-item> -->
    </el-menu>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const defaultActivePath = ref('/recommend')
// 监听当前路由
watch(
  () => router.currentRoute.value,
  newValue => {
    defaultActivePath.value = newValue.path
  },
  { immediate: true },
)

</script>

<style lang="scss" scoped>
.menu-container {
  flex: 1;
  .el-menu {
    --el-menu-bg-color: transparent !important;
    --el-menu-hover-bg-color: rgba(255, 255, 255, 0.1) !important;
    padding: 0 20px;
    border-right: none;
    .el-menu-item {
      height: 35px;
      line-height: 35px;
      font-size: 16px;
      border-radius: 8px;
      margin: 5px 0;
    }
    .el-menu-item.is-active {
      background-image: linear-gradient(to right, #fc3b5a 0%, #fc3d49 100%);
    }
  }
}
</style>

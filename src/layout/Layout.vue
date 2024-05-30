<template>
  <div class="layout-content_wrapper">
    <el-container
      class="top-container"
      :style="{
        height: isPlayer ? 'calc(100% - 80px)' : '100%'
      }"
    >
      <el-aside width="200px">
        <div class="logo">
          LOGO
        </div>
        <Menu />
      </el-aside>
      <el-container>
        <el-header>
          <Header />
        </el-header>
        <el-main>
          <el-scrollbar ref="LayoutScrollbar">
            <router-view v-slot="{ Component }">
              <transition name="fade-transform" mode="out-in">
                <keep-alive :include="cachedViews">
                  <component :is="Component" />
                </keep-alive>
              </transition>
            </router-view>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
    <el-footer v-show="isPlayer">
      <Footer />
    </el-footer>
  </div>
</template>

<script setup>
import Menu from './Menu.vue'
import Header from './Header.vue'
import Footer from './Footer.vue'
import { computed, provide, ref } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'
import { getCachedViews } from '@/utils'

const LayoutScrollbar = ref(null)
provide('LayoutScrollbar', LayoutScrollbar)
const playerStore = usePlayerStore()
const cachedViews = computed(() => getCachedViews())
const isPlayer = computed(() => !!playerStore.currentMusicUrl)
</script>

<style lang="scss" scoped>
.layout-content_wrapper {
  height: 100%;
  .top-container {
    .el-aside {
      display: flex;
      flex-direction: column;
      backdrop-filter: contrast(0.9);
      overflow: hidden;
      .logo {
        height: 60px;
        line-height: 60px;
        text-align: center;
        flex-shrink: 0;
      }
    }
    .el-header {
      padding: 0;
      height: 70px;
    }
    .el-main {
      padding: 0;
      height: calc(100% - 70px);
      :deep(.el-scrollbar__view) {
        display: flex;
        flex-direction: column;
      }
    }
  }
  .el-footer {
    padding: 0;
    width: 100%;
    height: 80px;
    background-color: #2d2d38;
    border-top: 1px solid #42424c;
    box-sizing: border-box;
  }
}
</style>

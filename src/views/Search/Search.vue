<template>
  <div class="search-container layout-content">
    <el-tabs v-model="activeName" class="tabs-view">
      <el-tab-pane lazy label="单曲" name="song">
        <Song />
      </el-tab-pane>

      <el-tab-pane lazy label="歌单" name="playlist">
        <PlayList />
      </el-tab-pane>

      <el-tab-pane lazy label="歌手" name="singer">
        <Singer />
      </el-tab-pane>

      <el-tab-pane lazy label="专辑" name="album">
        <Album />
      </el-tab-pane>

      <el-tab-pane lazy label="用户" name="user">
        <User />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import Song from './components/Song.vue'
import PlayList from './components/PlayList.vue'
import Singer from './components/Singer.vue'
import Album from './components/Album.vue'
import User from './components/User.vue'

const route = useRoute()
const activeName = ref('song')
watchEffect(() => {
  if (route.query.type) {
    activeName.value = route.query.type
  }
})
onBeforeMount(() => {
  activeName.value = route.query.type
})
</script>

<style lang="scss" scoped>
</style>

<template>
  <el-config-provider :locale="zhCn">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </el-config-provider>
</template>

<script setup name="App">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<style lang="scss">
#nprogress .bar {
  background: #fc3c53 !important;
}
#nprogress .peg {
  background: 0 0 10px #fc3c53, 0 0 5px #fc3c53 !important;
}
</style>

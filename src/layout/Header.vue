<template>
  <div class="header-container">
    <el-button class="back-btn" type="info" plain @click="back()">
      <el-icon :size="20">
        <ArrowLeft />
      </el-icon>
    </el-button>

    <AutoSearch @search="handleSearch" />

    <PersonalCenter />
  </div>
</template>

<script setup>
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import AutoSearch from './components/AutoSearch.vue'
import PersonalCenter from './components/PersonalCenter.vue'

const router = useRouter()

function handleSearch({ type, val }){
  router.push({
    path: '/search', query: {
      keywords: val, type,
    },
  })
}
function back(){
  router.go(-1)
}
</script>

<style lang="scss" scoped>
.header-container {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 40px;
    .back-btn {
        --el-button-text-color: #b9b9bb;
        --el-button-bg-color: transparent;
        --el-button-hover-bg-color: transparent;
        --el-button-border-color: rgba(168, 164, 166, 0.2);
        --el-button-hover-border-color: rgba(168, 164, 166, 0.3);
        border-radius: 8px;
        padding: 10px 5px;
        height: 40px;
        &:hover {
          backdrop-filter: contrast(0.9);
        }
    }
}
</style>

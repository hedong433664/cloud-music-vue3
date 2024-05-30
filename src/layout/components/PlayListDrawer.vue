<template>
  <div class="play-list-drawer_container">
    <el-drawer
      v-model="drawer"
      class="play-list-drawer"
      title="播放列表"
      :size="400"
      :show-close="false"
      :before-close="closeDrawer"
    >
      <template #header>
        <div class="play-list-drawer_header">
          <p class="title">
            播放列表（{{ playList.length }}）
          </p>
        </div>
      </template>
      <el-scrollbar>
        <song-table :song-list="playList" :show-album="false" :is-song-img-lazy="false" />
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, watch, onDeactivated } from 'vue'
import { usePlayerStore } from '@/stores/playerStore'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['update:show'])

watch(() => props.show, newVal => {
  drawer.value = newVal
})

const playerStore = usePlayerStore()
const playList = computed(() => playerStore.playList)
const drawer = ref(false)

function closeDrawer(){
  drawer.value = false
  emits('update:show', false)
}

onDeactivated(() => {
  drawer.value = false
})
</script>

<style lang="scss" scoped>
.play-list-drawer_container {
    :deep(.play-list-drawer) {
        height: calc(100vh - 70px - 80px - 30px);
        border-radius: 10px;
        top: 80px;
        .el-drawer__header {
            padding: 15px 20px;
            margin: 0;
            .play-list-drawer_header {
                display: flex;
                align-items: center;
                .title {
                    margin: 0;
                    font-weight: bold;
                }
            }
        }
        .el-drawer__body {
            padding: 8px;
        }
    }
}
</style>

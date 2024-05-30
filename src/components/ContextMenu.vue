<template>
  <div ref="ContextMenuRef">
    <slot />
    <Teleport to="body">
      <Transition
        @before-enter="handleBeforeEnter"
        @enter="handleEnter"
        @after-enter="handleAfterEnter"
      >
        <div v-if="showMenu" class="context-menu" :style="{left: x + 'px', top: y + 'px'}">
          <div class="menu-list">
            <div v-for="(item, index) in menu" :key="index" class="menu-item" @click="handleClick(item)">
              <i class="iconfont" :class="item.icon" />{{ item.label }}
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import useContextMenu from '@/hooks/useContextMenu'
defineProps({
  menu: {
    type: Array,
    default: () => [],
  },
})

const ContextMenuRef = ref(null)
const { showMenu, x, y } = useContextMenu(ContextMenuRef)

function handleClick(item){
  showMenu.value = false
  item.onClick()
}

function handleBeforeEnter(e){
  e.style.height = 0
}

function handleEnter(e){
  e.style.height = 'auto'
  const h = e.clientHeight
  e.style.height = 0
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      e.style.height = h + 'px'
      e.style.transition = '.2s'
    })
  })
}

function handleAfterEnter(e){
  e.style.transition = 'none'
}
</script>

<style lang="scss" scoped>
.context-menu {
    position: fixed;
    width: 160px;
    height: auto;
    border-radius: 8px;
    background-color: #2d2d38;
    border: 1px solid #42424c;
    box-shadow: 0 0 10px rgba(0, 0, 0, .5);
    overflow: hidden;
    z-index: 9999;
    .menu-list {
      display: flex;
      flex-direction: column;
      padding: 5px 0;
      .menu-item {
        display: flex;
        align-items: center;
        padding: 5px 10px;
        font-size: 14px;
        color: #b2b2b2;
        cursor: pointer;
        .iconfont {
          margin: 0 5px;
          font-size: 24px;
        }
        &:hover {
          background-color: #42424c;
        }
      }
    }
}
</style>

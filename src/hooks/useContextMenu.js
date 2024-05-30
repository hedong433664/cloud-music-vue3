import { ref, onMounted, onUnmounted } from 'vue'

export default function useContextMenu(container){
  // 右键菜单的显示状态
  const showMenu = ref(false)
  // 右键菜单的位置
  const x = ref(0)
  const y = ref(0)
  const openMenu = e => {
    e.preventDefault()
    e.stopPropagation()
    showMenu.value = true
    // 防止右键菜单打开位置在屏幕以外
    x.value = Math.min(Math.max(e.clientX, 0), window.innerWidth - 200)
    y.value = Math.min(Math.max(e.clientY, 0), window.innerHeight - 300)
  }
  function closeMenu(){
    showMenu.value = false
  }
  onMounted(() => {
    container.value.addEventListener('contextmenu', openMenu)
    container.value.addEventListener('click', closeMenu, true)
    container.value.addEventListener('contextmenu', closeMenu, true)
    window.addEventListener('contextmenu', closeMenu, true)
    window.addEventListener('click', closeMenu, true)
  })
  onUnmounted(() => {
    container.value?.removeEventListener('contextmenu', openMenu)
    container.value?.removeEventListener('click', closeMenu)
    container.value?.removeEventListener('contextmenu', closeMenu)
    window.removeEventListener('contextmenu', closeMenu, true)
    window.removeEventListener('click', closeMenu, true)
  })
  return {
    showMenu, x, y,
  }
}

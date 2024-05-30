import { ref } from 'vue'
import { ElLoading } from 'element-plus'
export default function useLoading(){
// 创建一个ref来保存加载状态
  const loadingInstance = ref(null)

  // 创建一个函数来控制加载状态
  function startLoading(){
  // 创建一个Element Plus的加载实例
    loadingInstance.value = ElLoading.service({
      lock: true,
      text: '拼命加载中...',
      background: 'rgba(0, 0, 0, 0.7)',
    })
  }

  function stopLoading(){
    loadingInstance.value.close()
  }

  return {
    startLoading, stopLoading,
  }
}

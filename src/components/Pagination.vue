<template>
  <el-pagination
    background
    layout="prev, pager, next"
    :total="total"
    :page-size="limit"
    @change="paginationChange"
  />
</template>

<script setup>
import { inject } from 'vue'
const emits = defineEmits(['change'])
defineProps({
  total: {
    type: Number,
    default: 0,
  },
  limit: {
    type: Number,
    default: 30,
  },
})
const LayoutScrollbar = inject('LayoutScrollbar')
function paginationChange(page, size){
  emits('change', page, size)
  LayoutScrollbar.value.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<style lang="scss" scoped>
</style>

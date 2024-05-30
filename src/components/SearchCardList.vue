<template>
  <div class="search-card-list_wrapper">
    <el-row :gutter="30">
      <el-col
        v-for="item in list"
        :key="item.id"
        :span="4"
      >
        <CardItem
          :cover-url="item[coverKey]"
          :play-count="item.playCount"
          :name="item[nameKey]"
          :show-icon="showIcon"
          :round="round"
          :text-align="textAlign"
          @click="emits('item-click', item)"
        />
      </el-col>
    </el-row>

    <el-empty v-if="!list.length" description="暂无数据" />

    <div v-if="total > 30" class="pagination-box">
      <Pagination
        :total="total"
        :page-size="limit"
        @change="paginationChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import useLoading from '@/hooks/useLoading'

const props = defineProps({
  showIcon: {
    type: Boolean,
    default: true,
  },
  coverKey: {
    type: String,
    default: 'coverImgUrl',
  },
  nameKey: {
    type: String,
    default: 'description',
  },
  round: {
    type: Boolean,
    default: false,
  },
  textAlign: {
    type: String,
    default: 'left',
  },
  data: {
    type: Array,
    default: () => [],
  },
  offset: {
    type: Number,
    default: 0,
  },
  limit: {
    type: Number,
    default: 30,
  },
  request: {
    type: Function,
    default: () => ({}),
  },
})
const emits = defineEmits(['item-click', 'update:offset', 'update:limit'])

const list = ref([])
const total = ref(0)

// 搜索
async function handleSearch(){
  const { startLoading, stopLoading } = useLoading()
  try {
    startLoading()
    const { content, totalElements } = await props.request()

    list.value = content || []
    total.value = totalElements || 0
  }

  finally {
    stopLoading()
  }
}

// 分页
function paginationChange(page, size){
  emits('update:offset', page - 1)
  emits('update:limit', size)
  handleSearch()
}

defineExpose({ handleSearch })

onMounted(() => {
  if (typeof props.request === 'function') {
    handleSearch()
  }
  else {
    list.value = props.data
  }
})
</script>

<style lang="scss" scoped>
.search-card-list_wrapper {
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .pagination-box {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
}
</style>

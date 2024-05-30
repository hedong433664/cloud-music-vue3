<template>
  <div class="search-popover_wrapper">
    <el-popover
      ref="PopoverRef"
      v-model:visible="visible"
      popper-class="search-popover"
      placement="bottom"
      width="300px"
      trigger="-"
      :show-arrow="false"
      :offset="10"
      :teleported="false"
    >
      <template #reference>
        <el-input
          v-model="keyword"
          class="search-input"
          :placeholder="placeholder"
          clearable
          @input="handelFuzzyQuery"
          @focus="visible = true"
          @click="visible = true"
          @blur="visible = false"
          @keydown.enter="handleSearch('song', keyword)"
        >
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
      </template>
      <el-scrollbar v-loading="searchLoading" element-loading-background="rgba(45, 45, 56, 0.8)" max-height="350px">
        <div class="scrollbar-content">
          <!-- 热门搜素 -->
          <div v-show="!keyword || !haveResults" class="hot-wrapper">
            <div
              v-for="(item, index) in hots"
              :key="index"
              class="hot-wrapper_item"
              @click="handleSearch('song', item.searchWord)"
            >
              <span class="index">{{ index + 1 }}</span>
              <span class="search-word">{{ item.searchWord }}</span>
              <span class="search-count">{{ item.score }}</span>
            </div>
          </div>
          <!-- 模糊查询 -->
          <div v-show="!!keyword && haveResults" class="fuzzy-query-wrapper">
            <p class="header">
              搜索建议
            </p>
            <div v-if="fuzzyQuery.songs?.length" class="title-box">
              <i class="iconfont icon-yinyue" />
              <span class="title">单曲</span>
            </div>
            <div
              v-for="(item, index) in fuzzyQuery.songs"
              :key="index"
              class="fuzzy-query-wrapper_item"
              @click="handleSearch('song', item.name)"
            >
              <span class="text">
                {{ item.name }}
              </span>
            </div>

            <div v-if="fuzzyQuery.artists?.length" class="title-box">
              <i class="iconfont icon-maikefeng" />
              <span class="title">歌手</span>
            </div>
            <div
              v-for="(item, index) in fuzzyQuery.artists"
              :key="index"
              class="fuzzy-query-wrapper_item"
              @click="handleSearch('singer', item.name)"
            >
              <span class="text">
                {{ item.name }}
              </span>
            </div>

            <div v-if="fuzzyQuery.albums?.length" class="title-box">
              <i class="iconfont icon-gengduo" />
              <span class="title">专辑</span>
            </div>
            <div
              v-for="(item, index) in fuzzyQuery.albums"
              :key="index"
              class="fuzzy-query-wrapper_item"
              @click="handleSearch('album', item.name)"
            >
              <span class="text">
                {{ item.name }}
              </span>
            </div>

            <div v-if="fuzzyQuery.playlists?.length" class="title-box">
              <i class="iconfont icon-gedan" />
              <span class="title">歌单</span>
            </div>
            <div
              v-for="(item, index) in fuzzyQuery.playlists"
              :key="index"
              class="fuzzy-query-wrapper_item"
              @click="handleSearch('playlist', item.name)"
            >
              <span class="text">
                {{ item.name }}
              </span>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </el-popover>
  </div>
</template>

<script setup>
import { onMounted, onDeactivated, ref, nextTick } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { hotDetailApi, suggestApi, searchHotApi } from '@/api'
import { debounce } from '@/utils/index.js'
import { ElMessage } from 'element-plus'

const emits = defineEmits(['search'])
const PopoverRef = ref(null)
const visible = ref(false)
const searchLoading = ref(false)
const keyword = ref('')
const hots = ref([])
const fuzzyQuery = ref({
  albums: [],
  artists: [],
  playlists: [],
  songs: [],
})
const haveResults = ref(false)
const placeholder = ref('')
const placeholderIndex = ref(0)
const hotsPlaceholder = ref([])

// 获取热门搜索详情
const getHotDetail = async() => {
  const { data } = await hotDetailApi()
  hots.value = data
}
let interval = null
const roundPlaceholder = () => {
  interval = setInterval(() => {
    if (placeholderIndex.value < hotsPlaceholder.value.length - 1) {
      placeholderIndex.value++
    }
    else {
      placeholderIndex.value = 0
    }
    placeholder.value = hotsPlaceholder.value[placeholderIndex.value].first
  }, 10000)
}
// 获取热门搜索
const getSearchHot = async() => {
  const { result } = await searchHotApi()
  hotsPlaceholder.value = result.hots
  placeholder.value = result.hots[0].first
  roundPlaceholder()
}
// 模糊搜索
const handelFuzzyQuery = debounce(async() => {
  if (keyword.value) {
    try {
      searchLoading.value = true
      const { result } = await suggestApi({ keywords: keyword.value })
      fuzzyQuery.value = result
      haveResults.value = Boolean(Object.keys(result).length)
    }
    catch (error) {
      ElMessage.error(error)
    }
    finally {
      searchLoading.value = false
    }
  }
  else {
    fuzzyQuery.value = {
      albums: [],
      artists: [],
      playlists: [],
      songs: [],
    }
  }
}, 500)
// 回车选择、或点击搜索
const handleSearch = (type, val) => {
  if (val) {
    keyword.value = val
  }
  else {
    keyword.value = placeholder.value
  }
  emits('search', {
    val: keyword.value || placeholder.value,
    type,
  })
  handelFuzzyQuery()
  nextTick(() => {
    visible.value = false
  })
}

onMounted(() => {
  getHotDetail()
  getSearchHot()
})

onDeactivated(() => {
  clearInterval(interval)
})
</script>

<style lang="scss" scoped>
.search-popover_wrapper {
  width: 240px;
  :deep(.search-popover) {
    padding: 0;
  }
  :deep(.search-input) {
    --el-input-height: 40px;
    --el-input-text-color: #fbfbfb;
    --el-input-bg-color: transparent;
    --el-input-border-color: rgba(168, 164, 166, 0.2);
    --el-input-hover-border-color: rgba(168, 164, 166, 0.3);
    --el-input-focus-border-color: rgba(168, 164, 166, 0.3);
    --el-input-border-radius: 8px;
    margin-left: 10px;
    .el-input__wrapper {
        &.is-focus {
          background-image: none;
          background-color: transparent;
        }
    }
  }
}
.scrollbar-content {
  min-height: 200px;
  padding-right: 10px;
}
.hot-wrapper {
  &_item:nth-child(1) {
    .index {
      color: #df3939;
    }
  }
  &_item:nth-child(2) {
    .index {
      color: #df3939;
    }
  }
  &_item:nth-child(3) {
    .index {
      color: #df3939;
    }
  }
  &_item {
    display: flex;
    align-items: center;
    height: 50px;
    border-radius: 3px;
    padding: 5px 5px;
    margin-bottom: 5px;
    .index {
      width: 20px;
      text-align: center;
      font-size: 16px;
      color: #999;
    }
    .search-word {
      font-size: 14px;
      color: #d2d2d2;
      margin-left: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
    }
    .search-count {
      font-size: 12px;
      color: #595959;
      margin-left: 10px;
    }
    &:hover {
      background-color: #393944;
    }
  }
}
.fuzzy-query-wrapper {
  .header {
    margin: 10px;
    padding: 0 10px;
    font-size: 16px;
    color: #818188;
  }
  .title-box {
    display: flex;
    align-items: center;
    padding: 5px 5px;
    cursor: default;
    i {
      width: 20px;
      font-size: 24px;
      color: #818188;
    }
    .title {
      margin-left: 5px;
      font-size: 16px;
      color: #818188;
    }
  }
  &_item {
    padding: 15px 5px;
    font-size: 14px;
    transition: all 0.3s;
    cursor: pointer;
    .text {
      display: block;
      margin-left: 25px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &:hover {
      background-color: #393944;
    }
  }
}
</style>

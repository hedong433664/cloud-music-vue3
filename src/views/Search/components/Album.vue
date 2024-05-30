<template>
  <SearchCardList
    ref="SearchCardListRef"
    v-model:offset="searchParams.offset"
    v-model:limit="searchParams.limit"
    :request="request"
    :show-icon="false"
    cover-key="picUrl"
    name-key="name"
    round
    text-align="center"
    @item-click="handleAlbumDetail"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchApi } from '@/api'

const route = useRoute()
const router = useRouter()
const SearchCardListRef = ref(null)
const searchParams = ref({
  keywords: route.query.keywords,
  type: '10',
  limit: 30,
  offset: 0,
})

async function request(){
  const { result } = await searchApi({
    keywords: route.query.keywords,
    type: searchParams.value.type,
    limit: searchParams.value.limit,
    offset: searchParams.value.offset,
  })
  return {
    content: result.albums,
    totalElements: result.albumCount,
  }
}

function handleAlbumDetail(item){
  router.push(`/albumDetail/${item.id}`)
}

watch(route, () => {
  searchParams.value.keywords = route.query.keywords
  searchParams.value.offset = 0
  SearchCardListRef.value.handleSearch()
}, { deep: true })
</script>

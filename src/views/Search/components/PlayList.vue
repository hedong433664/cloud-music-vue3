<template>
  <SearchCardList
    ref="SearchCardListRef"
    v-model:offset="searchParams.offset"
    v-model:limit="searchParams.limit"
    :request="request"
    name-key="name"
    @item-click="handlePlayList"
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
  type: '1000',
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
    content: result.playlists,
    totalElements: result.playlistCount,
  }
}

function handlePlayList(item){
  router.push(`/playListDetail/${item.id}`)
}

watch(route, () => {
  searchParams.value.keywords = route.query.keywords
  searchParams.value.offset = 0
  SearchCardListRef.value.handleSearch()
}, { deep: true })
</script>

<template>
  <SearchCardList
    ref="SearchCardListRef"
    v-model:offset="searchParams.offset"
    v-model:limit="searchParams.limit"
    :request="request"
    :show-icon="false"
    cover-key="avatarUrl"
    name-key="nickname"
    round
    @item-click="handleUserInfo"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPlaylistCollectorApi } from '@/api'

const route = useRoute()
const router = useRouter()
const SearchCardListRef = ref(null)
const searchParams = ref({
  id: route.params.id,
  limit: 30,
  offset: 0,
})

async function request(){
  const res = await getPlaylistCollectorApi({
    id: route.params.id,
    limit: searchParams.value.limit,
    offset: searchParams.value.offset,
  })
  return {
    content: res.subscribers,
    totalElements: res.total,
  }
}

function handleUserInfo(item){
  router.push(`/userInfo/${item.userId}`)
}

watch(route, () => {
  searchParams.value.id = route.query.id
  searchParams.value.offset = 0
  SearchCardListRef.value.handleSearch()
}, { deep: true })
</script>

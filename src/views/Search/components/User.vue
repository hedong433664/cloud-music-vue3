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
    text-align="center"
    @item-click="handleUserInfo"
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
  type: '1002',
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
    content: result.userprofiles,
    totalElements: result.userprofileCount,
  }
}

function handleUserInfo(item){
  router.push(`/userInfo/${item.userId}`)
}

watch(route, () => {
  searchParams.value.keywords = route.query.keywords
  searchParams.value.offset = 0
  SearchCardListRef.value.handleSearch()
}, { deep: true })
</script>

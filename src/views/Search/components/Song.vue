<template>
  <SearchTable ref="SearchTableRef" v-model:offset="searchParams.offset" v-model:limit="searchParams.limit" :request="request" />
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { searchApi } from '@/api'

const route = useRoute()
const SearchTableRef = ref(null)
const searchParams = ref({
  keywords: route.query.keywords,
  limit: 30,
  offset: 0,
})

async function request(){
  const { result } = await searchApi({
    keywords: route.query.keywords,
    limit: searchParams.value.limit,
    offset: searchParams.value.offset,
  })
  return {
    content: result.songs,
    totalElements: result.songCount,
  }
}

watch(route, () => {
  searchParams.value.keywords = route.query.keywords
  searchParams.value.offset = 0
  SearchTableRef.value.handleSearch()
}, { deep: true })
</script>

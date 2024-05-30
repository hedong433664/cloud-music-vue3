<template>
  <div class="comment-detail_container layout-content">
    <Comment :id="route.params.id" :type="route.query.type" target-type="0" show-target />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style lang="scss" scoped>

</style>

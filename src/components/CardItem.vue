<template>
  <div class="card-item_wrapper">
    <div :style="{borderRadius: round ? '50%' : '0'}" class="cover-img">
      <el-image
        :src="`${coverUrl}?param=175y175`"
        :lazy="lazy"
        :style="{
          width: round ? '80%':'100%',
          height: round ? '80%':'100%',
          borderRadius: round ? '50%' : '0',
        }"
      />
    </div>

    <div v-if="showIcon" class="play-counts">
      <i class="iconfont icon-bofang-solid" />
      <span class="counts">
        {{ formatCount(playCount) }}
      </span>
    </div>

    <div v-if="showIcon" class="mask">
      <i class="iconfont icon-bofang" />
    </div>
    <div class="description" :style="{textAlign}">
      {{ name }}
    </div>
  </div>
</template>

<script setup>
import { formatCount } from '@/utils/index'
defineProps({
  lazy: {
    type: Boolean,
    default: true,
  },
  coverUrl: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  playCount: {
    type: Number,
    default: 0,
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  round: {
    type: Boolean,
    default: false,
  },
  textAlign: {
    type: String,
    default: 'left',
  },
})
</script>

<style lang="scss" scoped>
.card-item_wrapper {
  position: relative;
  width: 175px;
  height: 225px;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 30px;
  transition: 0.3s;
  cursor: pointer;
  .cover-img {
    width: 175px;
    height: 175px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    .el-image {
      transition: 0.3s;
    }
  }
  .description {
    padding: 10px;
    font-size: 14px;
    // 超过两行显示省略号
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .play-counts {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    .icon-bofang-solid {
        font-size: 18px;
    }
    .counts {
      font-size: 14px;
      color: #ffffff;
      font-weight: bold;
    }
  }
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.3);
    transition: all 0.3s;
    .icon-bofang {
      position: absolute;
      right: 10px;
      bottom: 60px;
      font-size: 40px;
      color: #ffffff;
      transition: all 0.3s;
      opacity: 0;
      cursor: pointer;
    }
  }
  &:hover {
    background-color: rgb(45, 45, 56);
  }
  &:hover .icon-bofang,
  &:hover .mask {
    opacity: 1;
  }
  &:hover .cover-img {
    .el-image {
      transform: scale(1.1);
    }
  }
}
</style>

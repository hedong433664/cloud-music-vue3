<template>
  <div class="animation-box">
    <span class="item" /><span class="item" /><span class="item" />
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.animation-box {
  display: flex;
  justify-content: space-evenly;
  align-items: flex-end;
  width: 20px;
  height: 20px;
}

.item {
  width: 2px;
  border-radius: 5px 5px 0 0;
  background-color: #e93838;
}

.item:nth-child(1) {
  animation: myAnimation1 1s linear infinite;
}

.item:nth-child(2) {
  animation: myAnimation2 1s linear infinite;
}

.item:nth-child(3) {
  animation: myAnimation3 1s linear infinite;
}

@keyframes myAnimation1 {
  0% {
    height: 20px;
  }

  50% {
    height: 5px;
  }

  100% {
    height: 20px;
  }
}

@keyframes myAnimation2 {
  0% {
    height: 10px;
  }

  35% {
    height: 5px;
  }

  75% {
    height: 20px;
  }

  100% {
    height: 10px;
  }
}

@keyframes myAnimation3 {
  0% {
    height: 5px;
  }

  50% {
    height: 20px;
  }

  100% {
    height: 5px;
  }
}
</style>

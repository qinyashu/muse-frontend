<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 历史记录后续可从接口或本地缓存读取。
const tasks = []
</script>

<template>
  <div class="page history-page">
    <van-nav-bar title="历史任务" left-arrow @click-left="router.back()" />

    <van-empty v-if="!tasks.length" description="暂无历史任务">
      <van-button round type="primary" to="/">去创建</van-button>
    </van-empty>

    <van-cell-group v-else inset>
      <van-cell
        v-for="task in tasks"
        :key="task.id"
        :title="task.title"
        :label="task.status"
        is-link
        @click="router.push(`/task/${task.id}`)"
      />
    </van-cell-group>
  </div>
</template>

<style scoped>
.history-page {
  padding-top: 0;
}
</style>

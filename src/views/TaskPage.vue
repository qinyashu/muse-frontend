<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'

import { getTaskStatus } from '../api'

const route = useRoute()
const router = useRouter()

const taskId = computed(() => route.params.id)
const status = ref('queued')
const outputUrl = ref('')
const errorMessage = ref('')
const isPolling = ref(false)
let timer = null

const progress = computed(() => {
  const map = {
    queued: 15,
    processing: 65,
    done: 100,
    failed: 100,
  }
  return map[status.value] ?? 20
})

const statusText = computed(() => {
  const map = {
    queued: '排队中，请稍候...',
    processing: 'AI 生成中，预计需要1-2分钟...',
    done: '生成完成',
    failed: '生成失败，请重试',
  }
  return map[status.value] ?? '状态更新中...'
})

function stopPolling() {
  if (timer) {
    window.clearInterval(timer)
    timer = null
  }
}

async function loadStatus() {
  try {
    isPolling.value = true
    const response = await getTaskStatus(taskId.value)
    status.value = response.data.status
    outputUrl.value = response.data.output_url || ''
    errorMessage.value = response.data.error_message || ''

    if (['done', 'failed'].includes(status.value)) {
      stopPolling()
    }
  } catch (error) {
    showToast(error.response?.data?.detail || '查询任务状态失败')
  } finally {
    isPolling.value = false
  }
}

function downloadVideo() {
  if (!outputUrl.value) {
    return
  }

  // 使用临时 a 标签触发下载；跨域文件可能由浏览器改为新窗口打开。
  const link = document.createElement('a')
  link.href = outputUrl.value
  link.download = `task-${taskId.value}.mp4`
  link.target = '_blank'
  link.rel = 'noreferrer'
  link.click()
}

onMounted(() => {
  // 首次进入立即查询，随后每 2 秒轮询一次。
  loadStatus()
  timer = window.setInterval(loadStatus, 2000)
})

onUnmounted(() => {
  stopPolling()
})
</script>

<template>
  <div class="page task-page">
    <van-nav-bar title="任务详情" left-arrow @click-left="router.back()" />

    <section class="panel task-panel">
      <div class="task-id">任务 #{{ taskId }}</div>
      <h1 class="page-title">{{ statusText }}</h1>

      <van-progress
        v-if="status === 'queued' || status === 'processing'"
        :percentage="progress"
        stroke-width="8"
      />

      <p class="page-subtitle">
        {{ isPolling ? '正在刷新状态...' : '状态会自动更新' }}
      </p>
    </section>

    <section v-if="status === 'done' && outputUrl" class="panel video-panel">
      <video :src="outputUrl" controls playsinline preload="metadata"></video>
      <van-button class="download-button" block type="primary" @click="downloadVideo">
        下载视频
      </van-button>
    </section>

    <van-empty v-if="status === 'failed'" description="生成失败，请重试">
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <van-button round type="primary" to="/">重新创建</van-button>
    </van-empty>
  </div>
</template>

<style scoped>
.task-page {
  padding-top: 0;
}

.task-panel {
  margin-top: 16px;
  padding: 18px;
}

.task-id {
  color: #68738a;
  font-size: 13px;
}

.video-panel {
  margin-top: 16px;
  padding: 10px;
}

video {
  display: block;
  width: 100%;
  border-radius: 6px;
  background: #000000;
}

.download-button {
  margin-top: 12px;
}

.error-message {
  max-width: 320px;
  margin: 0 auto 14px;
  color: #68738a;
  font-size: 13px;
  line-height: 1.6;
  word-break: break-word;
}
</style>

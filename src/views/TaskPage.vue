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
    queued: '排队中，请稍等...',
    processing: 'AI 生成中，预计需要 1-2 分钟...',
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
  if (!outputUrl.value) return
  const link = document.createElement('a')
  link.href = outputUrl.value
  link.download = `task-${taskId.value}.mp4`
  link.target = '_blank'
  link.rel = 'noreferrer'
  link.click()
}

onMounted(() => {
  loadStatus()
  timer = window.setInterval(loadStatus, 2000)
})

onUnmounted(() => {
  stopPolling()
})
</script>

<template>
  <div class="mobile-page task-page">
    <van-nav-bar class="page-nav" title="任务详情" left-arrow @click-left="router.back()" />

    <main class="page-body task-body">
      <section class="status-card app-card">
        <span class="task-id">任务 #{{ taskId }}</span>
        <h1>{{ statusText }}</h1>
        <p>{{ isPolling ? '正在刷新状态...' : '状态会自动更新' }}</p>

        <van-progress
          v-if="status === 'queued' || status === 'processing'"
          class="task-progress"
          :percentage="progress"
          stroke-width="8"
          color="#667eea"
          track-color="#eef0f6"
        />
      </section>

      <section v-if="status === 'done'" class="result-card app-card">
        <video v-if="outputUrl" class="result-video" controls playsinline :src="outputUrl"></video>
        <button class="primary-action" type="button" @click="downloadVideo">保存视频</button>
      </section>

      <section v-else-if="status === 'failed'" class="result-card app-card">
        <van-icon class="failed-icon" name="warning-o" />
        <strong>任务生成失败</strong>
        <p>{{ errorMessage || '请检查抖音链接、模型服务或稍后重试。' }}</p>
        <button class="primary-action" type="button" @click="router.push('/create?type=sing')">重新创作</button>
      </section>
    </main>
  </div>
</template>

<style scoped>
.task-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-card {
  min-height: 170px;
  background:
    radial-gradient(circle at 86% 20%, rgba(102, 126, 234, 0.16), transparent 28%),
    #ffffff;
}

.task-id {
  display: inline-flex;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(102, 126, 234, 0.12);
  color: var(--app-primary);
  font-size: 12px;
  font-weight: 700;
}

.status-card h1 {
  margin: 20px 0 8px;
  font-size: 21px;
  line-height: 1.35;
}

.status-card p {
  margin: 0;
  color: var(--app-muted);
  font-size: 13px;
}

.task-progress {
  margin-top: 22px;
}

.result-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-align: center;
}

.result-video {
  width: 100%;
  max-height: 420px;
  border-radius: 12px;
  background: #101323;
}

.failed-icon {
  color: #ef4444;
  font-size: 44px;
}

.result-card strong {
  font-size: 18px;
}

.result-card p {
  margin: 0;
  color: var(--app-muted);
  font-size: 13px;
  line-height: 1.6;
}
</style>

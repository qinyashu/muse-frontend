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
  <div class="page task-page">
    <van-nav-bar class="dark-nav" title="任务详情" left-arrow @click-left="router.back()" />

    <section class="task-hero panel neon-panel">
      <div class="task-head">
        <div class="task-id">任务 #{{ taskId }}</div>
        <div class="refresh-badge">⟳</div>
      </div>
      <h1 class="task-title">{{ statusText }}</h1>
      <p class="task-subtitle">{{ isPolling ? '正在刷新状态...' : '状态会自动更新' }}</p>

      <van-progress
        v-if="status === 'queued' || status === 'processing'"
        class="task-progress"
        :percentage="progress"
        stroke-width="10"
        track-color="rgba(46, 52, 81, 0.92)"
      />

      <div class="task-status-block">
        <span class="status-dot" :class="status"></span>
        <span>{{ status === 'done' ? '已完成' : status === 'failed' ? '已失败' : '进行中' }}</span>
      </div>
    </section>

    <section v-if="status === 'done' && outputUrl" class="panel neon-panel video-panel">
      <div class="video-frame">
        <video :src="outputUrl" controls playsinline preload="metadata"></video>
      </div>
      <van-button class="download-button" block round type="primary" @click="downloadVideo">
        下载视频
      </van-button>
    </section>

    <section v-if="status === 'failed'" class="panel neon-panel fail-panel">
      <div class="fail-title">生成失败，请重试</div>
      <p v-if="errorMessage" class="fail-message">{{ errorMessage }}</p>
      <van-button round type="primary" to="/">返回首页</van-button>
    </section>
  </div>
</template>

<style scoped>
.task-page {
  min-height: 100dvh;
  padding: 0 16px 24px;
  background:
    radial-gradient(circle at top right, rgba(92, 56, 255, 0.2), transparent 22%),
    radial-gradient(circle at top left, rgba(0, 210, 255, 0.12), transparent 20%),
    linear-gradient(180deg, #050513 0%, #03030a 45%, #020208 100%);
  color: #f6f8ff;
}

.dark-nav {
  background: transparent;
  color: #fff;
}

.dark-nav :deep(.van-nav-bar__title) {
  color: #fff;
  font-size: 18px;
  font-weight: 700;
}

.dark-nav :deep(.van-icon) {
  color: #fff;
}

.task-hero {
  margin-top: 12px;
  padding: 16px;
}

.task-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.task-id {
  color: rgba(216, 221, 241, 0.72);
  font-size: 13px;
}

.refresh-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  border: 1px solid rgba(148, 115, 255, 0.55);
  background: linear-gradient(180deg, rgba(25, 29, 68, 0.95), rgba(12, 13, 31, 0.98));
  box-shadow: 0 0 18px rgba(143, 70, 255, 0.25);
  font-size: 28px;
}

.task-title {
  margin: 16px 0 0;
  font-size: 28px;
  line-height: 1.15;
  font-weight: 900;
}

.task-subtitle {
  margin: 8px 0 0;
  color: rgba(206, 212, 232, 0.74);
  font-size: 14px;
}

.task-progress {
  margin-top: 18px;
}

.task-status-block {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  color: rgba(229, 235, 255, 0.82);
  font-size: 14px;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #8aa0c8;
  box-shadow: 0 0 10px rgba(160, 178, 255, 0.25);
}

.status-dot.queued,
.status-dot.processing {
  background: #2f7dff;
}

.status-dot.done {
  background: #35ebc8;
}

.status-dot.failed {
  background: #ff6b95;
}

.video-panel,
.fail-panel {
  margin-top: 14px;
  padding: 14px;
}

.video-frame {
  border-radius: 18px;
  overflow: hidden;
  background: #000;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
}

video {
  display: block;
  width: 100%;
  border: 0;
  background: #000;
}

.download-button {
  margin-top: 12px;
  height: 52px;
  font-size: 16px;
  font-weight: 800;
  background: linear-gradient(90deg, #ff33dc 0%, #8f34ff 42%, #2f4eff 100%);
  border: none;
}

.fail-title {
  font-size: 22px;
  font-weight: 800;
}

.fail-message {
  margin: 10px 0 16px;
  color: rgba(206, 212, 232, 0.74);
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
}
</style>

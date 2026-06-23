<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

import { getTaskList } from '../api'
import { getDeviceId } from '../utils/device'

const router = useRouter()

const tasks = ref([])
const isLoading = ref(false)
const activeFilter = ref('all')

const runningCount = computed(() =>
  tasks.value.filter((task) => ['queued', 'processing'].includes(task.status)).length,
)

const doneCount = computed(() => tasks.value.filter((task) => task.status === 'done').length)

const filteredTasks = computed(() => {
  if (activeFilter.value === 'all') return tasks.value
  return tasks.value.filter((task) => task.type === activeFilter.value)
})

const isEmpty = computed(() => !isLoading.value && tasks.value.length === 0)

function getTaskTypeLabel(type) {
  const map = {
    sing: 'AI唱歌MV',
    dance: 'AI跳舞MV',
  }
  return map[type] || '其他'
}

function getStatusLabel(status) {
  const map = {
    queued: '排队中',
    processing: '生成中',
    done: '已完成',
    failed: '生成失败',
  }
  return map[status] || '处理中'
}

function getTaskTitle(task) {
  if (task.type === 'dance') return 'AI跳舞视频'
  if (task.type === 'sing') return 'AI唱歌视频'
  return 'AI视频作品'
}

function getProgress(task) {
  const map = {
    queued: 10,
    processing: 45,
    done: 100,
    failed: 100,
  }
  return map[task.status] || 0
}

function formatTime(value) {
  if (!value) return '暂无时间'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes(),
  ).padStart(2, '0')}`
}

async function loadTasks() {
  try {
    isLoading.value = true
    const response = await getTaskList(getDeviceId())
    tasks.value = response.data.tasks || []
  } catch (error) {
    if (error.response?.status === 404) {
      tasks.value = []
      return
    }
    showToast(error.response?.data?.detail || '获取创作记录失败')
  } finally {
    isLoading.value = false
  }
}

function openTask(task) {
  router.push(`/task/${task.id}`)
}

onMounted(() => {
  loadTasks()
})
</script>

<template>
  <div class="history-page">
    <header class="history-header">
      <button class="back-button" type="button" @click="router.push('/')">返回首页</button>
      <button class="refresh-button" type="button" @click="loadTasks">刷新</button>
    </header>

    <h1 class="history-title">我的创作记录</h1>

    <div class="history-counts">
      <span class="blue-dot"></span>
      <span>进行中 {{ runningCount }}</span>
      <span class="divider">|</span>
      <span>已完成 {{ doneCount }}</span>
    </div>

    <nav class="filter-tabs">
      <button
        class="filter-tab"
        :class="{ active: activeFilter === 'all' }"
        type="button"
        @click="activeFilter = 'all'"
      >
        全部
      </button>
      <button
        class="filter-tab"
        :class="{ active: activeFilter === 'sing' }"
        type="button"
        @click="activeFilter = 'sing'"
      >
        AI唱歌MV
      </button>
      <button
        class="filter-tab"
        :class="{ active: activeFilter === 'dance' }"
        type="button"
        @click="activeFilter = 'dance'"
      >
        AI跳舞MV
      </button>
      <button
        class="filter-tab"
        :class="{ active: activeFilter === 'other' }"
        type="button"
        @click="activeFilter = 'other'"
      >
        其他
      </button>
    </nav>

    <section v-if="isLoading" class="empty-card">
      <van-loading color="#7a8cff">加载中...</van-loading>
    </section>

    <section v-else-if="isEmpty" class="empty-card">
      <div class="empty-icon">+</div>
      <h2>暂无创作记录</h2>
      <p>生成视频后，任务进度和成品会显示在这里。</p>
      <button class="create-button" type="button" @click="router.push('/create?type=sing')">
        去创作
      </button>
    </section>

    <section v-else class="task-list">
      <button
        v-for="task in filteredTasks"
        :key="task.id"
        class="task-card"
        type="button"
        @click="openTask(task)"
      >
        <div class="task-cover">
          <span class="task-badge">{{ getTaskTypeLabel(task.type) }}</span>
          <span class="play-icon"></span>
          <span class="progress-number">{{ getProgress(task) }}%</span>
        </div>

        <div class="task-info">
          <div class="task-status" :class="task.status">{{ getStatusLabel(task.status) }}</div>
          <h2>{{ getTaskTitle(task) }}</h2>
          <p>创建时间：{{ formatTime(task.created_at) }}</p>

          <div v-if="task.status !== 'done'" class="progress-row">
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: `${getProgress(task)}%` }"></div>
            </div>
            <span>{{ getProgress(task) }}%</span>
          </div>

          <div v-if="task.status === 'done'" class="done-actions">
            <span>查看视频</span>
            <span>复制地址</span>
          </div>

          <p v-if="task.status === 'failed'" class="error-text">
            {{ task.error_message || '生成失败，请重试' }}
          </p>
        </div>
      </button>

      <div v-if="filteredTasks.length === 0" class="empty-card small-empty">
        <h2>这个分类暂无记录</h2>
        <p>切换分类或创建新任务后再查看。</p>
      </div>
    </section>

    <footer class="safe-note">内容仅自己可见，请放心使用</footer>
  </div>
</template>

<style scoped>
.history-page {
  min-height: 100dvh;
  padding: 18px 18px 28px;
  background:
    radial-gradient(circle at top right, rgba(73, 50, 210, 0.25), transparent 24%),
    linear-gradient(180deg, #050513 0%, #03030a 50%, #020208 100%);
  color: #f6f8ff;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-button,
.refresh-button {
  height: 36px;
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 16px;
}

.refresh-button {
  min-width: 72px;
  border-radius: 12px;
  border: 1px solid rgba(100, 132, 255, 0.45);
  background: rgba(14, 18, 43, 0.8);
}

.history-title {
  margin: 20px 0 12px;
  font-size: 34px;
  line-height: 1.15;
  font-weight: 900;
}

.history-counts {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(224, 229, 247, 0.86);
  font-size: 15px;
}

.blue-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #277bff;
  box-shadow: 0 0 12px rgba(39, 123, 255, 0.75);
}

.divider {
  color: rgba(150, 159, 190, 0.75);
}

.filter-tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 20px;
}

.filter-tab {
  height: 42px;
  border: 0;
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(24, 28, 53, 0.92), rgba(13, 16, 34, 0.96));
  color: rgba(212, 218, 239, 0.78);
  font-size: 14px;
  font-weight: 700;
}

.filter-tab.active {
  color: #fff;
  background: linear-gradient(90deg, rgba(108, 73, 255, 0.95), rgba(42, 128, 255, 0.95));
  box-shadow: 0 0 18px rgba(89, 105, 255, 0.26);
}

.empty-card {
  display: flex;
  min-height: 300px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  padding: 24px;
  border-radius: 24px;
  border: 1px solid rgba(116, 126, 255, 0.36);
  background: linear-gradient(180deg, rgba(18, 21, 48, 0.9), rgba(8, 10, 25, 0.96));
  text-align: center;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #9d43ff, #2ccfff);
  box-shadow: 0 0 30px rgba(95, 113, 255, 0.35);
  font-size: 42px;
  font-weight: 300;
}

.empty-card h2 {
  margin: 18px 0 8px;
  font-size: 22px;
}

.empty-card p {
  margin: 0;
  max-width: 260px;
  color: rgba(201, 207, 230, 0.78);
  font-size: 14px;
  line-height: 1.7;
}

.create-button {
  width: 100%;
  max-width: 240px;
  height: 48px;
  margin-top: 20px;
  border: 0;
  border-radius: 999px;
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  background: linear-gradient(90deg, #ff33dc 0%, #8f34ff 42%, #2f4eff 100%);
}

.task-list {
  display: grid;
  gap: 12px;
  margin-top: 20px;
}

.task-card {
  display: grid;
  grid-template-columns: 36% 1fr;
  gap: 14px;
  width: 100%;
  padding: 12px;
  border-radius: 20px;
  border: 1px solid rgba(95, 125, 255, 0.35);
  background: linear-gradient(180deg, rgba(17, 20, 43, 0.96), rgba(8, 10, 24, 0.98));
  color: #fff;
  text-align: left;
}

.task-cover {
  position: relative;
  min-height: 112px;
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(29, 35, 65, 0.95), rgba(14, 18, 35, 0.95));
  overflow: hidden;
}

.task-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 8px;
  border-radius: 8px;
  background: linear-gradient(90deg, #7c43ff, #2387ff);
  font-size: 12px;
  font-weight: 700;
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-top: 13px solid transparent;
  border-bottom: 13px solid transparent;
  border-left: 20px solid #fff;
  transform: translate(-40%, -50%);
}

.progress-number {
  position: absolute;
  right: 8px;
  bottom: 8px;
  font-size: 13px;
  font-weight: 800;
}

.task-info {
  min-width: 0;
}

.task-status {
  color: #8c7bff;
  font-size: 15px;
  font-weight: 800;
}

.task-status.done {
  color: #39cfff;
}

.task-status.failed {
  color: #ff6a9e;
}

.task-info h2 {
  margin: 6px 0;
  font-size: 20px;
  line-height: 1.2;
}

.task-info p {
  margin: 0;
  color: rgba(203, 209, 231, 0.76);
  font-size: 13px;
  line-height: 1.5;
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

.progress-track {
  flex: 1;
  height: 10px;
  border-radius: 999px;
  background: rgba(40, 47, 77, 0.9);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #ee5dff, #3bbdff);
}

.progress-row span {
  min-width: 38px;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  text-align: right;
}

.done-actions {
  display: flex;
  gap: 8px;
  margin-top: 14px;
}

.done-actions span {
  flex: 1;
  height: 34px;
  border-radius: 10px;
  border: 1px solid rgba(86, 132, 255, 0.55);
  color: #82c6ff;
  font-size: 13px;
  font-weight: 700;
  line-height: 32px;
  text-align: center;
}

.error-text {
  margin-top: 8px !important;
  color: rgba(255, 145, 175, 0.9) !important;
}

.small-empty {
  min-height: 180px;
}

.safe-note {
  margin-top: 18px;
  color: rgba(166, 173, 198, 0.72);
  font-size: 13px;
  text-align: center;
}
</style>

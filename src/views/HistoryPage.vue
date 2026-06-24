<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

import BottomNav from '../components/BottomNav.vue'
import { getTaskList } from '../api'
import { getDeviceId } from '../utils/device'

const router = useRouter()

const tasks = ref([])
const isLoading = ref(false)
const activeFilter = ref('all')

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
  return map[type] || 'AI视频'
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

function formatTime(value) {
  if (!value) return '暂无时间'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}`
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
  <div class="mobile-page history-page">
    <van-nav-bar class="page-nav" title="创作记录" left-arrow @click-left="router.back()" />

    <main class="page-body history-body">
      <section class="filter-card app-card">
        <button :class="{ active: activeFilter === 'all' }" type="button" @click="activeFilter = 'all'">
          全部
        </button>
        <button :class="{ active: activeFilter === 'sing' }" type="button" @click="activeFilter = 'sing'">
          唱歌MV
        </button>
        <button :class="{ active: activeFilter === 'dance' }" type="button" @click="activeFilter = 'dance'">
          跳舞MV
        </button>
      </section>

      <section v-if="isLoading" class="state-card app-card">
        <van-loading color="#667eea">加载中...</van-loading>
      </section>

      <section v-else-if="isEmpty" class="state-card app-card">
        <van-empty description="还没有创作记录" />
        <button class="primary-action" type="button" @click="router.push('/create?type=sing')">去创作</button>
      </section>

      <section v-else class="task-list">
        <button
          v-for="task in filteredTasks"
          :key="task.id"
          class="task-card app-card"
          type="button"
          @click="openTask(task)"
        >
          <span class="task-thumb"><van-icon name="video-o" /></span>
          <span class="task-copy">
            <strong>{{ getTaskTypeLabel(task.type) }}</strong>
            <small>{{ formatTime(task.created_at) }}</small>
          </span>
          <span class="task-status" :class="task.status">{{ getStatusLabel(task.status) }}</span>
        </button>
      </section>
    </main>

    <BottomNav active="records" />
  </div>
</template>

<style scoped>
.history-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.filter-card {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding: 8px;
}

.filter-card button {
  height: 34px;
  border: 0;
  border-radius: 17px;
  background: #f0f2f8;
  color: var(--app-muted);
  font-size: 13px;
  font-weight: 700;
}

.filter-card button.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff;
}

.state-card {
  display: flex;
  min-height: 260px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-card {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  border: 0;
  text-align: left;
}

.task-thumb {
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  border-radius: 14px;
  background: rgba(102, 126, 234, 0.12);
  color: var(--app-primary);
  font-size: 24px;
}

.task-copy strong,
.task-copy small {
  display: block;
}

.task-copy strong {
  font-size: 15px;
}

.task-copy small {
  margin-top: 5px;
  color: var(--app-muted);
  font-size: 12px;
}

.task-status {
  padding: 4px 8px;
  border-radius: 999px;
  background: #eef0f6;
  color: var(--app-muted);
  font-size: 12px;
  font-weight: 700;
}

.task-status.done {
  background: rgba(42, 190, 138, 0.12);
  color: #20a873;
}

.task-status.failed {
  background: rgba(239, 68, 68, 0.12);
  color: #dc2626;
}
</style>

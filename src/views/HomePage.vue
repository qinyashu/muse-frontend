<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

import { getUserInfo, registerUser } from '../api'
import { getDeviceId } from '../utils/device'

const router = useRouter()

const remainingCount = ref(0)
const isLoadingUser = ref(false)

// 加载当前设备的剩余次数；新设备未注册时自动注册。
async function loadUserInfo() {
  const deviceId = getDeviceId()
  isLoadingUser.value = true

  try {
    const response = await getUserInfo(deviceId)
    remainingCount.value = response.data.remaining_count
  } catch (error) {
    if (error.response?.status === 404) {
      const response = await registerUser(deviceId)
      remainingCount.value = response.data.remaining_count
    } else {
      showToast(error.response?.data?.detail || '获取剩余次数失败')
    }
  } finally {
    isLoadingUser.value = false
  }
}

function goCreate(type) {
  router.push({ path: '/create', query: { type } })
}

onMounted(() => {
  loadUserInfo()
})
</script>

<template>
  <div class="page home-page">
    <div class="home-header">
      <p class="eyebrow">AI MV 生成器</p>
      <h1 class="page-title">选择你的生成方式</h1>
      <p class="page-subtitle">
        剩余次数：<span>{{ isLoadingUser ? '加载中' : remainingCount }}</span>
      </p>
    </div>

    <div class="mv-grid">
      <button class="mv-card sing-card" type="button" @click="goCreate('sing')">
        <span class="mv-icon">🎤</span>
        <span class="mv-title">AI唱歌MV</span>
        <span class="mv-desc">上传照片，匹配抖音音频生成唱歌视频</span>
      </button>

      <button class="mv-card dance-card" type="button" @click="goCreate('dance')">
        <span class="mv-icon">💃</span>
        <span class="mv-title">AI跳舞MV</span>
        <span class="mv-desc">上传照片，匹配抖音动作生成跳舞视频</span>
      </button>
    </div>

    <van-button class="history-button" block plain type="primary" to="/history">
      查看历史任务
    </van-button>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
}

.home-header {
  padding-top: 12px;
}

.eyebrow {
  margin: 0;
  color: #2f7d6d;
  font-size: 13px;
  font-weight: 700;
}

.mv-grid {
  display: grid;
  gap: 14px;
  margin-top: 12px;
}

.mv-card {
  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 4px 12px;
  width: 100%;
  min-height: 132px;
  padding: 20px;
  border: 1px solid #e5eaf2;
  border-radius: 8px;
  background: #ffffff;
  color: #172033;
  text-align: left;
  box-shadow: 0 10px 28px rgba(23, 32, 51, 0.08);
}

.sing-card {
  border-left: 5px solid #ff6b6b;
}

.dance-card {
  border-left: 5px solid #2f7d6d;
}

.mv-icon {
  grid-row: span 2;
  align-self: center;
  font-size: 38px;
}

.mv-title {
  align-self: end;
  font-size: 21px;
  font-weight: 800;
}

.mv-desc {
  color: #68738a;
  font-size: 13px;
  line-height: 1.5;
}

.history-button {
  margin-top: 18px;
}
</style>

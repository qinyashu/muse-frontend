<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

import { getUserInfo, registerUser } from '../api'
import { getDeviceId } from '../utils/device'

const router = useRouter()
const remainingCount = ref(0)

async function syncUser() {
  const deviceId = getDeviceId()

  try {
    const response = await getUserInfo(deviceId)
    remainingCount.value = response.data.remaining_count ?? 0
  } catch (error) {
    if (error.response?.status === 404) {
      const response = await registerUser(deviceId)
      remainingCount.value = response.data.remaining_count ?? 0
    } else {
      showToast(error.response?.data?.detail || '获取剩余次数失败')
    }
  }
}

function goCreate(type = 'sing') {
  router.push({ path: '/create', query: { type } })
}

function goHistory() {
  router.push('/history')
}

function handleVip() {
  showToast('VIP 功能稍后开放')
}

onMounted(() => {
  syncUser()
})
</script>

<template>
  <div class="home-screen">
    <figure class="home-stage">
      <img class="home-reference" src="/home-reference.jpg" alt="星速AI 首页预览" draggable="false" />

      <div class="hotspots">
        <div class="cta-cover" aria-hidden="true"></div>
        <button class="hotspot vip-hotspot" type="button" aria-label="VIP 会员" @click="handleVip" />
        <button class="hotspot sing-hotspot" type="button" aria-label="AI唱歌MV" @click="goCreate('sing')" />
        <button class="hotspot dance-hotspot" type="button" aria-label="AI跳舞MV" @click="goCreate('dance')" />
        <button class="hotspot more-hotspot" type="button" aria-label="查看更多热门作品" @click="goHistory" />
        <button class="hotspot stat-hotspot" type="button" aria-label="AI视频作品" @click="goHistory" />
        <button class="hotspot home-nav-hotspot" type="button" aria-label="首页" @click="router.push('/')" />
        <button class="hotspot create-nav-hotspot" type="button" aria-label="创作" @click="goCreate('sing')" />
        <button class="hotspot my-nav-hotspot" type="button" aria-label="我的" @click="goHistory" />
      </div>
    </figure>

    <div class="home-filler">
      <span class="sr-only">剩余次数：{{ remainingCount }}</span>
    </div>
  </div>
</template>

<style scoped>
.home-screen {
  min-height: 100dvh;
  background:
    radial-gradient(circle at 50% 0%, rgba(126, 85, 255, 0.18), transparent 28%),
    linear-gradient(180deg, #050513 0%, #03030a 42%, #020208 100%);
  overflow-x: hidden;
}

.home-stage {
  position: relative;
  margin: 0;
  line-height: 0;
}

.home-reference {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
}

.hotspots {
  position: absolute;
  inset: 0;
}

.cta-cover {
  position: absolute;
  z-index: 1;
  top: 19.1%;
  left: 13.8%;
  width: 72.4%;
  height: 11.6%;
  border-radius: 24px;
  background:
    radial-gradient(circle at 18% 35%, rgba(112, 69, 255, 0.18), transparent 38%),
    radial-gradient(circle at 82% 32%, rgba(34, 222, 255, 0.16), transparent 36%),
    linear-gradient(135deg, rgba(8, 8, 26, 0.98), rgba(6, 7, 20, 0.98));
  box-shadow: 0 0 26px rgba(3, 4, 18, 0.5);
  pointer-events: none;
}

.hotspot {
  position: absolute;
  z-index: 2;
  display: block;
  padding: 0;
  border: 0;
  background: transparent;
  border-radius: 999px;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.hotspot:focus-visible {
  outline: 2px solid rgba(114, 214, 255, 0.95);
  outline-offset: 2px;
}

.vip-hotspot { top: 1.8%; right: 2.1%; width: 17.8%; height: 4.2%; }
.sing-hotspot { top: 30.2%; left: 6.9%; width: 86.6%; height: 18.9%; }
.dance-hotspot { top: 49.0%; left: 6.9%; width: 86.6%; height: 18.9%; }
.more-hotspot { top: 66.9%; right: 2.6%; width: 22.5%; height: 4.6%; }
.stat-hotspot { top: 79.2%; left: 7.4%; width: 85.8%; height: 9.2%; }
.home-nav-hotspot { top: 90.8%; left: 5.8%; width: 19.8%; height: 7.8%; }
.create-nav-hotspot { top: 87.9%; left: 38.0%; width: 24.0%; height: 11.2%; border-radius: 50%; }
.my-nav-hotspot { top: 90.8%; right: 6.6%; width: 16.2%; height: 7.8%; }

.home-filler {
  flex: 1;
  background:
    radial-gradient(circle at top center, rgba(95, 64, 255, 0.12), transparent 36%),
    linear-gradient(180deg, rgba(2, 2, 8, 0.96), #020208);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>

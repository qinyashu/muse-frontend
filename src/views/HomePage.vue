<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

import BottomNav from '../components/BottomNav.vue'
import { getHotVideos, getUserInfo, registerUser } from '../api'
import { isUnlimitedAccount, saveAuth } from '../utils/auth'
import { getDeviceId } from '../utils/device'

const router = useRouter()
const remainingCount = ref(0)
const isUnlimited = ref(isUnlimitedAccount())
const hotVideos = ref([])
const showVideoPreview = ref(false)
const selectedVideo = ref(null)
const VIP_MARK_KEY = 'muse_vip_mark'

const displayCount = computed(() => (isUnlimited.value ? '无限' : remainingCount.value))
const showVipMark = computed(() => isUnlimited.value || (remainingCount.value > 0 && localStorage.getItem(VIP_MARK_KEY) === '1'))

async function syncUser() {
  const deviceId = getDeviceId()

  try {
    const response = await getUserInfo(deviceId)
    remainingCount.value = response.data.remaining_count ?? 0
    isUnlimited.value = Boolean(response.data.is_unlimited)
    saveAuth({ device_id: deviceId, is_unlimited: isUnlimited.value })
    updateVipMark(remainingCount.value, isUnlimited.value)
  } catch (error) {
    if (error.response?.status === 404) {
      const response = await registerUser(deviceId)
      remainingCount.value = response.data.remaining_count ?? 0
      isUnlimited.value = Boolean(response.data.is_unlimited)
      saveAuth({ device_id: deviceId, is_unlimited: isUnlimited.value })
      updateVipMark(remainingCount.value, isUnlimited.value)
      return
    }

    showToast(error.response?.data?.detail || '获取剩余次数失败')
  }
}

async function loadHotVideos() {
  try {
    const response = await getHotVideos()
    hotVideos.value = (response.data.videos || []).map((video) => ({
      id: video.id,
      title: video.title,
      views: video.views,
      cover: video.cover_url,
      videoUrl: video.video_url,
    }))
  } catch (error) {
    hotVideos.value = []
    showToast(error.response?.data?.detail || '获取热门作品失败')
  }
}

function updateVipMark(count, unlimited) {
  if (unlimited) {
    localStorage.setItem(VIP_MARK_KEY, '1')
    return
  }

  if (count <= 0) {
    localStorage.removeItem(VIP_MARK_KEY)
    return
  }

  if (count >= 60) {
    localStorage.setItem(VIP_MARK_KEY, '1')
  }
}

function goCreate(type = 'sing') {
  router.push({ path: '/create', query: { type } })
}

function openHotVideo(video) {
  if (!video.videoUrl) {
    showToast('请先配置真实视频地址')
    return
  }

  selectedVideo.value = video
  showVideoPreview.value = true
}

function handleVip() {
  router.push('/service')
}

onMounted(() => {
  syncUser()
  loadHotVideos()
})
</script>

<template>
  <div class="mobile-page home-page">
    <van-nav-bar class="page-nav">
      <template #title>
        <span>星速<span class="ai-text" translate="no">AI</span></span>
      </template>
      <template #right>
        <button v-if="showVipMark" class="nav-pill" type="button" @click="router.push('/member')">VIP</button>
      </template>
    </van-nav-bar>

    <main class="page-body home-body">
      <section class="balance-card app-card">
        <div>
          <span class="eyebrow">剩余创作次数</span>
          <strong :class="{ unlimited: isUnlimited }">{{ displayCount }}</strong>
        </div>
        <button type="button" @click="handleVip">充值</button>
      </section>

      <section class="hero-card app-card">
        <div class="hero-copy">
          <span class="hero-eyebrow">一键生成专属<span class="ai-text" translate="no">AI</span>大片</span>
          <h1>星速<span class="ai-text" translate="no">AI</span>创作</h1>
          <p>上传照片，粘贴抖音链接或上传本地视频，快速生成唱歌或跳舞 MV。</p>
        </div>
        <div class="hero-planet" aria-hidden="true"></div>
      </section>

      <section class="entry-grid" aria-label="创作入口">
        <button class="entry-card app-card sing-entry" type="button" @click="goCreate('sing')">
          <span class="entry-badge">HOT</span>
          <span class="entry-icon"><van-icon name="music-o" /></span>
          <strong><span class="ai-text" translate="no">AI</span>唱歌MV</strong>
          <small>照片变歌手，生成专属演唱视频</small>
        </button>

        <button class="entry-card app-card dance-entry" type="button" @click="goCreate('dance')">
          <span class="entry-badge">NEW</span>
          <span class="entry-icon"><van-icon name="fire-o" /></span>
          <strong><span class="ai-text" translate="no">AI</span>跳舞MV</strong>
          <small>照片驱动动作，生成热门舞蹈视频</small>
        </button>
      </section>

      <div class="section-heading hot-heading">
        <strong><span class="ai-text" translate="no">AI</span>热门作品</strong>
      </div>

      <section class="hot-card app-card">
        <div v-if="hotVideos.length" class="video-scroll" aria-label="热门视频列表">
          <button
            v-for="video in hotVideos"
            :key="video.id"
            class="hot-video-card"
            type="button"
            :aria-label="video.title"
            @click="openHotVideo(video)"
          >
            <img :src="video.cover" :alt="video.title" />
            <span class="video-shade"></span>
            <span class="video-views">
              <van-icon name="play-circle-o" />
              {{ video.views || '热门' }}
            </span>
          </button>
        </div>
        <div v-else class="empty-hot">
          暂无热门作品
        </div>
      </section>
    </main>

    <BottomNav active="home" />

    <van-popup v-model:show="showVideoPreview" round closeable class="video-popup">
      <video
        v-if="selectedVideo"
        class="preview-video"
        controls
        playsinline
        :poster="selectedVideo.cover"
        :src="selectedVideo.videoUrl"
      ></video>
    </van-popup>
  </div>
</template>

<style scoped>
.ai-text {
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
}

.nav-pill {
  height: 26px;
  padding: 0 12px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
}

.home-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.balance-card {
  display: flex;
  min-height: 88px;
  align-items: center;
  justify-content: space-between;
  background:
    radial-gradient(circle at 86% 18%, rgba(102, 126, 234, 0.14), transparent 28%),
    #ffffff;
}

.eyebrow {
  display: block;
  color: var(--app-muted);
  font-size: 12px;
  font-weight: 600;
}

.balance-card strong {
  display: block;
  margin-top: 4px;
  color: var(--app-primary);
  font-size: 38px;
  line-height: 1;
}

.balance-card strong.unlimited {
  font-size: 30px;
}

.balance-card button {
  width: 76px;
  height: 34px;
  border: 0;
  border-radius: 18px;
  background: rgba(102, 126, 234, 0.12);
  color: var(--app-primary);
  font-size: 13px;
  font-weight: 700;
}

.hero-card {
  position: relative;
  min-height: 132px;
  overflow: hidden;
  background:
    radial-gradient(circle at 75% 36%, rgba(122, 75, 162, 0.82), transparent 23%),
    radial-gradient(circle at 88% 14%, rgba(102, 126, 234, 0.5), transparent 28%),
    linear-gradient(135deg, #1a1a2e 0%, #2d2d44 52%, #121425 100%);
  color: #ffffff;
}

.hero-copy {
  position: relative;
  z-index: 1;
  max-width: 72%;
}

.hero-eyebrow {
  display: block;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  line-height: 1.3;
}

.hero-copy h1 {
  margin: 7px 0 8px;
  font-size: 28px;
  line-height: 1.12;
}

.hero-copy h1 .ai-text {
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
}

.hero-copy p {
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 13px;
  line-height: 1.55;
}

.hero-planet {
  position: absolute;
  right: -24px;
  bottom: -34px;
  width: 138px;
  height: 138px;
  border-radius: 50%;
  background:
    linear-gradient(22deg, transparent 43%, rgba(255, 255, 255, 0.52) 47%, transparent 52%),
    radial-gradient(circle at 42% 38%, #8fa0ff, #764ba2 48%, #20224a 74%);
  box-shadow: 0 0 42px rgba(102, 126, 234, 0.44);
  opacity: 0.9;
}

.entry-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.entry-card {
  position: relative;
  display: flex;
  min-height: 148px;
  flex-direction: column;
  align-items: flex-start;
  border: 0;
  text-align: left;
}

.entry-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  color: #ffffff;
  font-size: 10px;
  font-weight: 800;
  line-height: 20px;
}

.sing-entry .entry-badge {
  background: #ec5ce2;
}

.dance-entry .entry-badge {
  background: #24c6dc;
}

.entry-icon {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 12px;
  color: #ffffff;
  font-size: 24px;
}

.sing-entry .entry-icon {
  background: linear-gradient(135deg, #ff72d2, #764ba2);
}

.dance-entry .entry-icon {
  background: linear-gradient(135deg, #24c6dc, #667eea);
}

.entry-card strong {
  margin-top: 18px;
  font-size: 17px;
  line-height: 1.25;
}

.entry-card small {
  margin-top: 7px;
  color: var(--app-muted);
  font-size: 12px;
  line-height: 1.45;
}

.hot-heading {
  margin-bottom: 0;
}

.hot-card {
  padding: 12px;
}

.video-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.video-scroll::-webkit-scrollbar {
  display: none;
}

.hot-video-card {
  position: relative;
  width: 112px;
  height: 78px;
  flex: 0 0 112px;
  overflow: hidden;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: #141827;
}

.hot-video-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.5));
}

.video-views {
  position: absolute;
  left: 6px;
  bottom: 5px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
}

.video-views .van-icon {
  font-size: 13px;
}

.empty-hot {
  display: grid;
  min-height: 78px;
  place-items: center;
  color: var(--app-muted);
  font-size: 13px;
}

.video-popup {
  width: min(92vw, 390px);
  overflow: hidden;
  background: #101323;
}

.preview-video {
  display: block;
  width: 100%;
  max-height: 70vh;
  background: #101323;
}
</style>

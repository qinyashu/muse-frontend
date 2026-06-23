<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'

import { createTask } from '../api'
import { getDeviceId } from '../utils/device'

const route = useRoute()
const router = useRouter()

const photoList = ref([])
const douyinUrl = ref('')
const isSubmitting = ref(false)

const type = computed(() => (route.query.type === 'dance' ? 'dance' : 'sing'))

const pageMeta = computed(() =>
  type.value === 'dance'
    ? {
        title: 'AI跳舞MV',
        hero: '/ref-create-dance.jpg',
        tips: '上传一张清晰照片，再粘贴抖音链接，AI为你生成专属舞蹈MV大片',
        buttonClass: 'dance',
      }
    : {
        title: 'AI唱歌MV',
        hero: '/ref-create-sing.jpg',
        tips: '上传一张清晰照片，再粘贴抖音链接，AI为你生成专属演唱MV大片',
        buttonClass: 'sing',
      },
)

async function submitTask() {
  if (isSubmitting.value) return

  const photoFile = photoList.value[0]?.file
  const cleanDouyinUrl = douyinUrl.value.trim()

  if (!photoFile) {
    showToast('请先上传照片')
    return
  }

  if (!cleanDouyinUrl) {
    showToast('请先粘贴抖音链接')
    return
  }

  try {
    isSubmitting.value = true
    const response = await createTask(getDeviceId(), type.value, cleanDouyinUrl, photoFile)
    showToast('任务已提交')
    router.push(`/task/${response.data.task_id}`)
  } catch (error) {
    showToast(error.response?.data?.detail || '提交失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="page create-page">
    <van-nav-bar class="dark-nav" title="创建任务" left-arrow @click-left="router.back()" />

    <section class="hero">
      <img class="hero-image" :src="pageMeta.hero" :alt="pageMeta.title" />
      <div class="hero-mask">
        <h1 class="hero-title">{{ pageMeta.title }}</h1>
        <p class="hero-desc">{{ pageMeta.tips }}</p>
      </div>
    </section>

    <section class="panel neon-panel upload-panel">
      <div class="panel-title-row">
        <h2 class="panel-title">照片</h2>
        <span class="panel-icon">i</span>
      </div>
      <van-uploader
        v-model="photoList"
        class="photo-uploader"
        :max-count="1"
        accept="image/*"
        preview-size="100%"
      >
        <div class="upload-placeholder">
          <div class="upload-camera">📷</div>
          <div class="upload-main">点击上传清晰照片</div>
          <div class="upload-sub">支持 JPG / PNG 格式</div>
        </div>
      </van-uploader>
    </section>

    <section class="panel neon-panel field-panel">
      <div class="panel-title-row">
        <h2 class="panel-title">抖音链接</h2>
        <span class="panel-icon">i</span>
      </div>
      <van-field
        v-model="douyinUrl"
        class="dark-field"
        type="textarea"
        rows="1"
        autosize
        placeholder="粘贴抖音分享链接"
      >
        <template #right-icon>
          <span class="link-icon">🔗</span>
        </template>
      </van-field>
    </section>

    <section class="panel neon-panel tips-panel">
      <div class="tips-title">💡 小贴士</div>
      <p>照片越清晰，生成效果越好哦~</p>
      <p>建议使用正面清晰照，效果更佳！</p>
      <div class="tips-planet">🪐</div>
    </section>

    <van-button
      class="generate-button"
      :class="pageMeta.buttonClass"
      block
      round
      :loading="isSubmitting"
      @click="submitTask"
    >
      立即生成 ✨
    </van-button>

    <div class="footer-note">生成内容仅自己可见，请放心使用</div>
  </div>
</template>

<style scoped>
.create-page {
  min-height: 100dvh;
  padding: 0 16px 24px;
  background:
    radial-gradient(circle at top right, rgba(92, 56, 255, 0.24), transparent 26%),
    radial-gradient(circle at top left, rgba(0, 210, 255, 0.15), transparent 22%),
    linear-gradient(180deg, #050513 0%, #04040d 36%, #020208 100%);
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

.hero {
  position: relative;
  margin: 10px 0 14px;
  border-radius: 24px;
  overflow: hidden;
}

.hero-image {
  display: block;
  width: 100%;
  height: auto;
}

.hero-mask {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 18px 16px 14px;
  background: linear-gradient(180deg, rgba(3, 3, 12, 0.08) 0%, rgba(3, 3, 12, 0.14) 100%);
}

.hero-title {
  margin: 0;
  width: min(74%, 330px);
  font-size: clamp(26px, 7.4vw, 32px);
  line-height: 1.05;
  font-weight: 900;
  letter-spacing: 0;
  text-shadow: 0 0 18px rgba(255, 255, 255, 0.12);
}

.hero-desc {
  margin: 14px 0 0;
  width: min(84%, 340px);
  color: rgba(243, 246, 255, 0.92);
  font-size: 15px;
  line-height: 1.65;
}

.neon-panel {
  position: relative;
  margin-top: 14px;
  padding: 14px;
  border-radius: 22px;
  border: 1px solid rgba(146, 101, 255, 0.34);
  background: linear-gradient(180deg, rgba(17, 18, 42, 0.94), rgba(11, 12, 28, 0.98));
  box-shadow:
    inset 0 0 0 1px rgba(103, 154, 255, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.02),
    0 16px 36px rgba(0, 0, 0, 0.42);
}

.neon-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255, 92, 221, 0.72), rgba(58, 237, 255, 0.66));
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
  pointer-events: none;
  opacity: 0.78;
}

.panel-title-row {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.panel-title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #fff;
}

.panel-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(183, 192, 255, 0.26);
  color: rgba(235, 240, 255, 0.72);
  font-size: 16px;
}

.photo-uploader {
  width: 100%;
}

.photo-uploader :deep(.van-uploader__wrapper) {
  width: 100%;
}

.photo-uploader :deep(.van-uploader__input-wrapper) {
  width: 100%;
}

.photo-uploader :deep(.van-uploader__preview) {
  width: 100%;
  margin: 0;
}

.upload-placeholder {
  display: flex;
  min-height: 196px;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 18px;
  border: 1px dashed rgba(147, 161, 210, 0.28);
  background: rgba(7, 10, 28, 0.62);
}

.upload-camera {
  font-size: 34px;
  line-height: 1;
}

.upload-main {
  font-size: 18px;
  font-weight: 700;
  color: #f5f7ff;
}

.upload-sub {
  font-size: 13px;
  color: rgba(189, 196, 223, 0.76);
}

.field-panel {
  overflow: hidden;
}

.dark-field {
  position: relative;
  z-index: 1;
  padding: 0;
  background: transparent;
}

.dark-field :deep(.van-cell) {
  padding: 14px 18px;
  background: rgba(7, 10, 28, 0.84);
  border-radius: 16px;
  color: #f5f7ff;
}

.dark-field :deep(.van-field__control) {
  color: #fff;
}

.dark-field :deep(.van-field__control::placeholder) {
  color: rgba(171, 180, 205, 0.7);
}

.link-icon {
  font-size: 22px;
  line-height: 1;
  filter: drop-shadow(0 0 10px rgba(55, 230, 255, 0.5));
}

.tips-panel {
  min-height: 120px;
  overflow: hidden;
}

.tips-title {
  position: relative;
  z-index: 1;
  font-size: 20px;
  font-weight: 800;
}

.tips-panel p {
  position: relative;
  z-index: 1;
  margin: 8px 0 0;
  max-width: 72%;
  font-size: 15px;
  line-height: 1.7;
  color: rgba(238, 242, 255, 0.88);
}

.tips-planet {
  position: absolute;
  right: 18px;
  bottom: 18px;
  font-size: 42px;
}

.generate-button {
  margin-top: 18px;
  height: 58px;
  border: none;
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  box-shadow: 0 12px 26px rgba(22, 144, 255, 0.28);
}

.generate-button.sing {
  background: linear-gradient(90deg, #ff33dc 0%, #8f34ff 42%, #2f4eff 100%);
}

.generate-button.dance {
  background: linear-gradient(90deg, #0ee6ef 0%, #2e92ff 42%, #34f5cd 100%);
}

.footer-note {
  margin-top: 12px;
  text-align: center;
  color: rgba(172, 179, 203, 0.74);
  font-size: 13px;
}
</style>

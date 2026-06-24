<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'

import BottomNav from '../components/BottomNav.vue'
import { createTask } from '../api'
import { getDeviceId } from '../utils/device'

const route = useRoute()
const router = useRouter()

const photoList = ref([])
const videoList = ref([])
const douyinUrl = ref('')
const isSubmitting = ref(false)

const type = computed(() => (route.query.type === 'dance' ? 'dance' : 'sing'))
const pageTitle = computed(() => (type.value === 'dance' ? 'AI跳舞MV' : 'AI唱歌MV'))
const titleSuffix = computed(() => (type.value === 'dance' ? '跳舞MV' : '唱歌MV'))
const subtitle = computed(() =>
  type.value === 'dance'
    ? '上传一张清晰照片，再粘贴舞蹈视频链接。'
    : '上传一张清晰照片，再粘贴抖音音乐视频链接。',
)
const linkPlaceholder = computed(() =>
  type.value === 'dance' ? '请粘贴舞蹈视频分享链接' : '请粘贴抖音音乐视频分享链接',
)
const videoTip = computed(() =>
  type.value === 'dance'
    ? '上传舞蹈参考视频后，可不填写抖音链接。'
    : '上传带音乐的视频后，系统会自动提取音频，可不填写抖音链接。',
)

function handlePhotoReady() {
  showToast('照片已上传')
}

function handleVideoReady() {
  showToast('本地视频已选择')
}

async function submitTask() {
  if (isSubmitting.value) return

  const photoFile = photoList.value[0]?.file
  const sourceVideoFile = videoList.value[0]?.file
  const cleanDouyinUrl = douyinUrl.value.trim()

  if (!photoFile) {
    showToast('请先上传照片')
    return
  }

  if (!cleanDouyinUrl && !sourceVideoFile) {
    showToast('请粘贴抖音链接或上传本地视频')
    return
  }

  try {
    isSubmitting.value = true
    const response = await createTask(getDeviceId(), type.value, cleanDouyinUrl, photoFile, sourceVideoFile)
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
  <div class="mobile-page create-page">
    <van-nav-bar class="page-nav" left-arrow @click-left="router.push('/home')">
      <template #title>
        <span><span class="ai-text" translate="no">AI</span>{{ titleSuffix }}</span>
      </template>
    </van-nav-bar>

    <main class="page-body create-body">
      <section class="mode-card app-card" :class="type">
        <div>
          <span class="mode-label">当前创作模式</span>
          <strong class="mode-title"><span class="ai-text" translate="no">AI</span>{{ titleSuffix }}</strong>
          <p class="mode-description">{{ subtitle }}<span class="ai-text" translate="no">AI</span> 会自动处理素材并生成专属 MV。</p>
        </div>
        <span class="mode-icon">
          <van-icon :name="type === 'dance' ? 'fire-o' : 'music-o'" />
        </span>
      </section>

      <section class="upload-card app-card">
        <div class="card-title">
          <strong>上传照片</strong>
          <span>正脸清晰效果更好</span>
        </div>

        <van-uploader
          v-model="photoList"
          class="photo-uploader"
          :max-count="1"
          accept="image/*"
          :after-read="handlePhotoReady"
        >
          <div class="upload-box">
            <van-icon name="photograph" />
            <strong>点击上传照片</strong>
            <span>支持 JPG / PNG</span>
          </div>
        </van-uploader>
      </section>

      <section class="link-card app-card">
        <div class="card-title">
          <strong>抖音链接</strong>
          <span>也可以直接上传本地视频</span>
        </div>

        <label class="douyin-input">
          <input v-model="douyinUrl" type="url" :placeholder="linkPlaceholder" />
          <van-icon name="link-o" />
        </label>

        <p class="form-tip">小贴士：链接越完整，解析成功率越高；如果链接失效，请换一个公开视频。</p>
      </section>

      <section class="video-card app-card">
        <div class="card-title">
          <strong>上传本地视频</strong>
          <span>链接不可用时使用</span>
        </div>

        <van-uploader
          v-model="videoList"
          class="video-uploader"
          :max-count="1"
          accept="video/*"
          :preview-image="false"
          :after-read="handleVideoReady"
        >
          <div class="video-upload-row">
            <van-icon name="video-o" />
            <div>
              <strong>点击上传视频</strong>
              <span>支持 MP4 / MOV</span>
            </div>
          </div>
        </van-uploader>

        <p v-if="videoList[0]?.file?.name" class="selected-video-name">
          已选择：{{ videoList[0].file.name }}
        </p>
        <p class="form-tip">{{ videoTip }}</p>
      </section>

      <button class="primary-action submit-button" type="button" :disabled="isSubmitting" @click="submitTask">
        {{ isSubmitting ? '正在提交...' : '立即生成' }}
      </button>
    </main>

    <BottomNav />
  </div>
</template>

<style scoped>
.ai-text {
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
}

.create-body {
  display: flex;
  min-height: 0;
  flex-direction: column;
  gap: 12px;
}

.mode-card {
  display: grid;
  min-height: 116px;
  grid-template-columns: minmax(0, 1fr) 64px;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  background:
    radial-gradient(circle at 88% 18%, rgba(102, 126, 234, 0.16), transparent 24%),
    #ffffff;
}

.mode-label {
  display: block;
  color: var(--app-muted);
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
}

.mode-title {
  display: block;
  margin-top: 4px;
  font-size: 22px;
  line-height: 1.2;
}

.mode-description {
  display: -webkit-box;
  overflow: hidden;
  margin: 8px 0 0;
  color: var(--app-muted);
  font-size: 13px;
  line-height: 1.55;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.mode-icon {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border-radius: 18px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff !important;
  font-size: 30px !important;
  box-shadow: 0 12px 22px rgba(102, 126, 234, 0.22);
}

.mode-card.dance .mode-icon {
  background: linear-gradient(135deg, #24c6dc, #667eea);
}

.card-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.card-title strong {
  font-size: 16px;
}

.card-title span {
  color: var(--app-muted);
  font-size: 12px;
}

.photo-uploader {
  display: flex;
  justify-content: center;
  --upload-size: min(280px, calc(100vw - 96px));
}

.photo-uploader :deep(.van-uploader__wrapper),
.photo-uploader :deep(.van-uploader__input-wrapper),
.upload-box {
  width: var(--upload-size);
  height: var(--upload-size);
}

.photo-uploader :deep(.van-uploader__preview) {
  margin: 0;
}

.photo-uploader :deep(.van-uploader__preview-image) {
  width: var(--upload-size);
  height: var(--upload-size);
  border-radius: 12px;
  object-fit: cover;
}

.upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px dashed rgba(102, 126, 234, 0.38);
  border-radius: 12px;
  background:
    radial-gradient(circle at 50% 22%, rgba(102, 126, 234, 0.12), transparent 38%),
    #f7f8fc;
  color: var(--app-text);
}

.upload-box .van-icon {
  color: var(--app-primary);
  font-size: 38px;
}

.upload-box strong {
  font-size: 15px;
}

.upload-box span {
  color: var(--app-muted);
  font-size: 12px;
}

.douyin-input {
  display: grid;
  height: 46px;
  grid-template-columns: minmax(0, 1fr) 34px;
  align-items: center;
  padding: 0 12px;
  border-radius: 12px;
  background: #f7f8fc;
  box-shadow: inset 0 0 0 1px rgba(31, 36, 48, 0.06);
}

.douyin-input input {
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--app-text);
  font-size: 14px;
}

.douyin-input input::placeholder {
  color: #a0a7b8;
}

.douyin-input .van-icon {
  color: var(--app-primary);
  font-size: 22px;
}

.video-uploader,
.video-uploader :deep(.van-uploader__wrapper),
.video-uploader :deep(.van-uploader__input-wrapper) {
  width: 100%;
}

.video-uploader :deep(.van-uploader__preview) {
  width: 100%;
  margin: 0;
}

.video-uploader :deep(.van-uploader__file) {
  width: 100%;
  height: 52px;
  border-radius: 12px;
  background: #f7f8fc;
}

.video-upload-row {
  display: flex;
  min-height: 52px;
  align-items: center;
  gap: 12px;
  padding: 0 14px;
  border: 1px dashed rgba(102, 126, 234, 0.38);
  border-radius: 12px;
  background: #f7f8fc;
}

.video-upload-row .van-icon {
  flex: 0 0 auto;
  color: var(--app-primary);
  font-size: 28px;
}

.video-upload-row strong,
.video-upload-row span {
  display: block;
}

.video-upload-row strong {
  color: var(--app-text);
  font-size: 14px;
}

.video-upload-row span {
  margin-top: 3px;
  color: var(--app-muted);
  font-size: 12px;
}

.selected-video-name {
  margin: 10px 0 0;
  color: var(--app-text);
  font-size: 12px;
  line-height: 1.45;
  word-break: break-all;
}

.form-tip {
  margin: 10px 0 0;
  color: var(--app-muted);
  font-size: 12px;
  line-height: 1.55;
}

.submit-button {
  flex: 0 0 44px;
  margin-top: auto;
}
</style>

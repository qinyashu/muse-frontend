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

const pageImage = computed(() =>
  type.value === 'dance' ? '/ref-create-dance.jpg' : '/ref-create-sing.jpg',
)

function handlePhotoReady() {
  showToast('照片已上传')
}

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
  <div class="create-screen" :class="type">
    <figure class="create-stage">
      <img class="reference-page" :src="pageImage" alt="创建任务" draggable="false" />

      <button class="hotspot back-hotspot" type="button" aria-label="返回" @click="router.back()" />

      <van-uploader
        v-model="photoList"
        class="upload-hotspot"
        :max-count="1"
        accept="image/*"
        :after-read="handlePhotoReady"
      >
        <button class="upload-hit" type="button" aria-label="上传照片" />
      </van-uploader>

      <textarea
        v-model="douyinUrl"
        class="douyin-input"
        rows="1"
        aria-label="抖音链接"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
      />

      <button
        class="hotspot submit-hotspot"
        type="button"
        aria-label="立即生成"
        :disabled="isSubmitting"
        @click="submitTask"
      />
    </figure>
  </div>
</template>

<style scoped>
.create-screen {
  min-height: 100dvh;
  background: #020208;
  overflow-x: hidden;
}

.create-stage {
  position: relative;
  margin: 0;
  line-height: 0;
}

.reference-page {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
}

.hotspot,
.upload-hotspot,
.douyin-input {
  position: absolute;
  z-index: 2;
}

.hotspot,
.upload-hit {
  display: block;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.back-hotspot {
  top: 1.5%;
  left: 2.8%;
  width: 10%;
  height: 5.5%;
}

.upload-hotspot {
  left: 9.5%;
  width: 81%;
  height: 17.8%;
  opacity: 0.01;
}

.sing .upload-hotspot {
  top: 33.4%;
}

.dance .upload-hotspot {
  top: 37.6%;
}

.upload-hit,
.upload-hotspot :deep(.van-uploader__wrapper),
.upload-hotspot :deep(.van-uploader__input-wrapper) {
  width: 100%;
  height: 100%;
}

.upload-hotspot :deep(.van-uploader__preview) {
  display: none;
}

.douyin-input {
  left: 11.5%;
  width: 70%;
  min-height: 5.2%;
  padding: 0;
  border: 0;
  outline: 0;
  resize: none;
  overflow: hidden;
  background: transparent;
  color: rgba(238, 243, 255, 0.96);
  font-size: clamp(13px, 3.8vw, 17px);
  line-height: 1.35;
}

.sing .douyin-input {
  top: 62.0%;
}

.dance .douyin-input {
  top: 65.8%;
}

.submit-hotspot {
  left: 6.5%;
  width: 87%;
  height: 7.8%;
  border-radius: 999px;
}

.sing .submit-hotspot {
  top: 86.7%;
}

.dance .submit-hotspot {
  top: 87.7%;
}
</style>

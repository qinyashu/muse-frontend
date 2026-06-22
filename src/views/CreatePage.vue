<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'

import { createTask } from '../api'
import { getDeviceId } from '../utils/device'

const route = useRoute()
const router = useRouter()

const fileList = ref([])
const douyinUrl = ref('')
const isSubmitting = ref(false)

// 从 query 中读取生成类型，只允许 sing 或 dance。
const type = computed(() => {
  return route.query.type === 'dance' ? 'dance' : 'sing'
})

const pageTitle = computed(() => {
  return type.value === 'dance' ? 'AI跳舞MV' : 'AI唱歌MV'
})

async function submitTask() {
  if (isSubmitting.value) {
    return
  }

  const photoFile = fileList.value[0]?.file
  const cleanDouyinUrl = douyinUrl.value.trim()

  if (!photoFile) {
    showToast('请先上传照片')
    return
  }

  if (!cleanDouyinUrl) {
    showToast('请粘贴抖音链接')
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
    <van-nav-bar title="创建任务" left-arrow @click-left="router.back()" />

    <h1 class="page-title">{{ pageTitle }}</h1>
    <p class="page-subtitle">上传一张清晰照片，再粘贴抖音链接。</p>

    <section class="panel upload-panel">
      <div class="section-title">照片</div>
      <van-uploader
        v-model="fileList"
        :max-count="1"
        accept="image/*"
        preview-size="112"
      />
    </section>

    <section class="panel form-panel">
      <van-field
        v-model="douyinUrl"
        rows="4"
        autosize
        type="textarea"
        label="抖音链接"
        placeholder="粘贴抖音分享链接"
      />
    </section>

    <van-button
      class="submit-button"
      block
      round
      type="primary"
      :loading="isSubmitting"
      @click="submitTask"
    >
      立即生成
    </van-button>
  </div>
</template>

<style scoped>
.create-page {
  padding-top: 0;
}

.upload-panel,
.form-panel {
  padding: 16px;
}

.section-title {
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: 700;
}

.form-panel {
  margin-top: 14px;
  padding: 4px 0;
  overflow: hidden;
}

.submit-button {
  margin-top: 18px;
  height: 48px;
  font-weight: 700;
}
</style>

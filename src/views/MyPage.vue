<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showConfirmDialog, showToast } from 'vant'

import BottomNav from '../components/BottomNav.vue'
import { clearAuth } from '../utils/auth'

const router = useRouter()

const PROFILE_NAME_KEY = 'muse_profile_name'
const PROFILE_AVATAR_KEY = 'muse_profile_avatar'

const profileName = ref(localStorage.getItem(PROFILE_NAME_KEY) || '星速用户')
const draftName = ref(profileName.value)
const avatarUrl = ref(localStorage.getItem(PROFILE_AVATAR_KEY) || '')
const isEditingName = ref(false)

const menuItems = [
  {
    key: 'vip',
    label: '会员中心',
    icon: 'diamond-o',
    action: () => router.push('/member'),
  },
  {
    key: 'service',
    label: '在线客服',
    icon: 'service-o',
    action: () => router.push('/service'),
  },
  {
    key: 'agreement',
    label: '用户协议',
    icon: 'description-o',
    action: () => router.push('/legal/user'),
  },
  {
    key: 'privacy',
    label: '隐私政策',
    icon: 'shield-o',
    action: () => router.push('/legal/privacy'),
  },
  {
    key: 'version',
    label: '当前版本',
    icon: 'info-o',
    value: 'v7.1.9',
    action: () => showToast('当前版本 v7.1.9'),
  },
  {
    key: 'logout',
    label: '退出登录',
    icon: 'revoke',
    action: handleLogout,
  },
]

function handleAvatarRead(fileItem) {
  if (fileItem.content) {
    avatarUrl.value = fileItem.content
    localStorage.setItem(PROFILE_AVATAR_KEY, fileItem.content)
    showToast('头像已更新')
    return
  }

  // 兼容部分浏览器没有直接返回 content 的情况。
  const reader = new FileReader()
  reader.onload = () => {
    avatarUrl.value = reader.result
    localStorage.setItem(PROFILE_AVATAR_KEY, reader.result)
    showToast('头像已更新')
  }
  reader.readAsDataURL(fileItem.file)
}

function startEditName() {
  draftName.value = profileName.value
  isEditingName.value = true
}

function saveName() {
  const nextName = draftName.value.trim()
  if (!nextName) {
    showToast('昵称不能为空')
    return
  }

  profileName.value = nextName
  localStorage.setItem(PROFILE_NAME_KEY, nextName)
  isEditingName.value = false
  showToast('昵称已更新')
}

function cancelEditName() {
  draftName.value = profileName.value
  isEditingName.value = false
}

function handleLogout() {
  showConfirmDialog({
    title: '退出登录',
    message: '是否退出当前账户',
    confirmButtonText: '是',
    cancelButtonText: '否',
  })
    .then(() => {
      clearAuth()
      router.replace('/login')
    })
    .catch(() => {})
}
</script>

<template>
  <div class="mobile-page profile-page">
    <van-nav-bar class="page-nav" title="我的" />

    <main class="page-body profile-body">
      <section class="profile-card app-card">
        <van-uploader
          class="avatar-uploader"
          accept="image/*"
          :max-count="1"
          :show-upload="false"
          :after-read="handleAvatarRead"
        >
          <div class="avatar">
            <img v-if="avatarUrl" :src="avatarUrl" alt="用户头像" />
            <van-icon v-else name="star-o" />
            <span>换头像</span>
          </div>
        </van-uploader>

        <div v-if="!isEditingName" class="name-row">
          <strong>{{ profileName }}</strong>
          <button type="button" @click="startEditName">修改</button>
        </div>

        <div v-else class="name-editor">
          <input v-model="draftName" maxlength="12" placeholder="请输入昵称" @keyup.enter="saveName" />
          <button type="button" @click="cancelEditName">取消</button>
          <button type="button" class="save-name" @click="saveName">保存</button>
        </div>

      </section>

      <section class="menu-card app-card" aria-label="我的功能">
        <button
          v-for="item in menuItems"
          :key="item.key"
          class="menu-item"
          type="button"
          @click="item.action"
        >
          <span class="menu-icon"><van-icon :name="item.icon" /></span>
          <span class="menu-label">{{ item.label }}</span>
          <span v-if="item.value" class="menu-value">{{ item.value }}</span>
          <van-icon class="menu-arrow" name="arrow" />
        </button>
      </section>
    </main>

    <BottomNav active="mine" />
  </div>
</template>

<style scoped>
.profile-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profile-card {
  display: flex;
  min-height: 196px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 50% 8%, rgba(102, 126, 234, 0.18), transparent 34%),
    #ffffff;
  text-align: center;
}

.avatar-uploader {
  display: block;
}

.avatar-uploader :deep(.van-uploader__wrapper),
.avatar-uploader :deep(.van-uploader__input-wrapper) {
  display: block;
}

.avatar {
  position: relative;
  display: grid;
  width: 76px;
  height: 76px;
  place-items: center;
  overflow: hidden;
  border-radius: 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff;
  font-size: 36px;
  box-shadow: 0 14px 28px rgba(102, 126, 234, 0.24);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar span {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 22px;
  background: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  font-size: 11px;
  line-height: 22px;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
}

.name-row strong {
  max-width: 180px;
  overflow: hidden;
  font-size: 18px;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.name-row button,
.name-editor button {
  height: 26px;
  padding: 0 10px;
  border: 0;
  border-radius: 13px;
  background: rgba(102, 126, 234, 0.12);
  color: var(--app-primary);
  font-size: 12px;
  font-weight: 700;
}

.name-editor {
  display: grid;
  width: 100%;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 8px;
  margin-top: 14px;
}

.name-editor input {
  min-width: 0;
  height: 34px;
  padding: 0 12px;
  border: 0;
  border-radius: 17px;
  outline: 0;
  background: #f0f2f8;
  color: var(--app-text);
  font-size: 14px;
  text-align: center;
}

.name-editor .save-name {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff;
}

.menu-card {
  padding: 8px 16px;
}

.menu-item {
  display: grid;
  width: 100%;
  height: 48px;
  grid-template-columns: 32px minmax(0, 1fr) auto 18px;
  align-items: center;
  gap: 10px;
  padding: 0;
  border: 0;
  border-bottom: 1px solid rgba(31, 36, 48, 0.06);
  background: transparent;
  color: var(--app-text);
  text-align: left;
}

.menu-item:last-child {
  border-bottom: 0;
}

.menu-icon {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 9px;
  background: rgba(102, 126, 234, 0.11);
  color: var(--app-primary);
  font-size: 17px;
}

.menu-label {
  min-width: 0;
  font-size: 15px;
  font-weight: 600;
}

.menu-value {
  color: var(--app-muted);
  font-size: 13px;
}

.menu-arrow {
  color: #b2b8c7;
  font-size: 16px;
}
</style>

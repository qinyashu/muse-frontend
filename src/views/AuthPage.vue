<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

import { loginAccount, registerAccount } from '../api'
import { saveAuth } from '../utils/auth'

const router = useRouter()

const activeMode = ref('login')
const phone = ref('')
const password = ref('')
const agreed = ref(false)
const passwordVisible = ref(false)
const isSubmitting = ref(false)

function switchMode(mode) {
  activeMode.value = mode
  password.value = ''
}

function toggleModeFromHint() {
  switchMode(activeMode.value === 'login' ? 'register' : 'login')
}

async function submitAuth() {
  if (isSubmitting.value) return

  const cleanPhone = phone.value.trim()
  const cleanPassword = password.value.trim()

  if (!cleanPhone) {
    showToast('请先填写手机号')
    return
  }

  if (!cleanPassword) {
    showToast('请先填写密码')
    return
  }

  if (!agreed.value) {
    showToast('请先阅读并同意用户协议和隐私政策')
    return
  }

  try {
    isSubmitting.value = true
    const response =
      activeMode.value === 'login'
        ? await loginAccount(cleanPhone, cleanPassword)
        : await registerAccount(cleanPhone, cleanPassword)

    saveAuth(response.data)
    showToast(activeMode.value === 'login' ? '登录成功' : '注册成功')
    router.replace('/home')
  } catch (error) {
    showToast(error.response?.data?.detail || (activeMode.value === 'login' ? '登录失败' : '注册失败'))
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="mobile-page auth-page">
    <main class="auth-body">
      <section class="auth-brand">
        <div class="brand-mark">
          <van-icon name="star-o" />
        </div>
        <h1>星速<span translate="no">AI</span></h1>
        <p>照片生成唱歌、跳舞 MV</p>
      </section>

      <section class="auth-card app-card">
        <div class="mode-tabs">
          <button
            class="mode-tab"
            :class="{ active: activeMode === 'login' }"
            type="button"
            @click="switchMode('login')"
          >
            登录
          </button>
          <button
            class="mode-tab"
            :class="{ active: activeMode === 'register' }"
            type="button"
            @click="switchMode('register')"
          >
            注册
          </button>
        </div>

        <label class="auth-input">
          <van-icon name="phone-o" />
          <input v-model="phone" inputmode="tel" placeholder="请输入手机号" />
        </label>

        <label class="auth-input">
          <van-icon name="lock" />
          <input
            v-model="password"
            :type="passwordVisible ? 'text' : 'password'"
            placeholder="请输入密码"
          />
          <button type="button" @click="passwordVisible = !passwordVisible">
            <van-icon :name="passwordVisible ? 'eye-o' : 'closed-eye'" />
          </button>
        </label>

        <label class="agreement-line">
          <input v-model="agreed" type="checkbox" />
          <span>
            我已阅读并同意
            <button type="button" @click="router.push('/legal/user')">用户协议</button>
            和
            <button type="button" @click="router.push('/legal/privacy')">隐私政策</button>
          </span>
        </label>

        <button class="primary-action" type="button" :disabled="isSubmitting" @click="submitAuth">
          {{ isSubmitting ? '请稍候...' : activeMode === 'login' ? '立即登录' : '立即注册' }}
        </button>

        <button class="mode-hint" type="button" @click="toggleModeFromHint">
          {{ activeMode === 'login' ? '还没有账号？去注册' : '已有账号？去登录' }}
        </button>
      </section>
    </main>
  </div>
</template>

<style scoped>
.auth-page {
  background:
    radial-gradient(circle at 50% 18%, rgba(102, 126, 234, 0.3), transparent 28%),
    linear-gradient(180deg, #1a1a2e 0%, #2d2d44 44%, #f5f6fa 44%, #f5f6fa 100%);
}

.auth-body {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  gap: 22px;
  padding: calc(24px + env(safe-area-inset-top)) 16px calc(24px + env(safe-area-inset-bottom));
}

.auth-brand {
  color: #ffffff;
  text-align: center;
}

.brand-mark {
  display: grid;
  width: 76px;
  height: 76px;
  place-items: center;
  margin: 0 auto 12px;
  border-radius: 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  font-size: 36px;
  box-shadow: 0 18px 36px rgba(102, 126, 234, 0.28);
}

.auth-brand h1 {
  margin: 0;
  font-size: 28px;
  line-height: 1.2;
}

.auth-brand p {
  margin: 8px 0 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 14px;
}

.auth-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.mode-tabs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 4px;
  border-radius: 16px;
  background: #f0f2f8;
}

.mode-tab {
  height: 36px;
  border: 0;
  border-radius: 13px;
  background: transparent;
  color: var(--app-muted);
  font-size: 14px;
  font-weight: 700;
}

.mode-tab.active {
  background: #ffffff;
  color: var(--app-primary);
  box-shadow: 0 4px 12px rgba(27, 35, 62, 0.08);
}

.auth-input {
  display: grid;
  height: 46px;
  grid-template-columns: 26px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-radius: 12px;
  background: #f7f8fc;
}

.auth-input > .van-icon {
  color: var(--app-primary);
  font-size: 18px;
}

.auth-input input {
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--app-text);
  font-size: 14px;
}

.auth-input button {
  border: 0;
  background: transparent;
  color: #a0a7b8;
  font-size: 18px;
}

.agreement-line {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: var(--app-muted);
  font-size: 12px;
  line-height: 1.6;
}

.agreement-line input {
  margin-top: 3px;
}

.agreement-line button,
.mode-hint {
  border: 0;
  background: transparent;
  color: var(--app-primary);
}

.mode-hint {
  align-self: center;
  font-size: 13px;
}
</style>

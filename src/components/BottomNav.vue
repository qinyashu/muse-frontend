<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  active: {
    type: String,
    default: '',
  },
})

const router = useRouter()

function goHome() {
  router.push('/home')
}

function goRecords() {
  router.push('/history')
}

function goMine() {
  router.push('/me')
}
</script>

<template>
  <nav class="bottom-tabbar" aria-label="底部导航">
    <button
      class="tab-button"
      :class="{ active: props.active === 'home' }"
      type="button"
      @click="goHome"
    >
      <van-icon name="wap-home-o" />
      <span>首页</span>
    </button>

    <button
      class="tab-button"
      :class="{ active: props.active === 'records' }"
      type="button"
      @click="goRecords"
    >
      <van-icon name="orders-o" />
      <span>创作记录</span>
    </button>

    <button
      class="tab-button"
      :class="{ active: props.active === 'mine' }"
      type="button"
      @click="goMine"
    >
      <van-icon name="manager-o" />
      <span>我的</span>
    </button>
  </nav>
</template>

<style scoped>
.bottom-tabbar {
  display: grid;
  height: calc(var(--app-bottom-height) + env(safe-area-inset-bottom));
  flex: 0 0 calc(var(--app-bottom-height) + env(safe-area-inset-bottom));
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding-bottom: env(safe-area-inset-bottom);
  border-top: 1px solid rgba(31, 36, 48, 0.08);
  background: #ffffff;
  box-shadow: 0 -8px 24px rgba(27, 35, 62, 0.08);
}

.tab-button {
  display: flex;
  min-width: 0;
  height: var(--app-bottom-height);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #8b93a6;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.1;
  -webkit-tap-highlight-color: transparent;
}

.tab-button .van-icon {
  font-size: 20px;
}

.tab-button.active {
  color: var(--app-primary);
}
</style>

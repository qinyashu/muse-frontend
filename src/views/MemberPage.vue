<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const vipPlans = [
  { name: '尝鲜包', price: '19.9元', count: '3 次' },
  { name: '创作包', price: '99 元', count: '15 次' },
  { name: '专业包', price: '299 元', count: '60 次', featured: true },
  { name: '尊享包', price: '499 元', count: '120 次' },
]
</script>

<template>
  <div class="mobile-page member-page">
    <van-nav-bar class="page-nav" title="会员中心" left-arrow @click-left="router.back()" />

    <main class="page-body member-body">
      <section class="member-card app-card" aria-label="会员中心价格表">
        <header class="member-header">
          <span>会员中心</span>
          <h1>选择适合你的创作套餐</h1>
          <p>购买后获得对应生成下载次数，暂不接入支付。</p>
        </header>

        <div class="plan-table">
          <div class="plan-row plan-head">
            <span>套餐</span>
            <span>价格</span>
            <span>生成下载次数</span>
          </div>

          <div
            v-for="plan in vipPlans"
            :key="plan.name"
            class="plan-row"
            :class="{ featured: plan.featured }"
          >
            <span class="plan-name">
              {{ plan.name }}
              <em v-if="plan.featured">主推</em>
            </span>
            <span>{{ plan.price }}</span>
            <span>{{ plan.count }}</span>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.member-header {
  margin-bottom: 16px;
}

.member-header span {
  color: var(--app-primary);
  font-size: 13px;
  font-weight: 700;
}

.member-header h1 {
  margin: 5px 0 6px;
  color: var(--app-text);
  font-size: 22px;
  line-height: 1.25;
}

.member-header p {
  margin: 0;
  color: var(--app-muted);
  font-size: 13px;
  line-height: 1.6;
}

.plan-table {
  overflow: hidden;
  border: 1px solid rgba(31, 36, 48, 0.08);
  border-radius: 14px;
  background: #ffffff;
}

.plan-row {
  display: grid;
  min-height: 58px;
  grid-template-columns: 1.12fr 0.88fr 1fr;
  align-items: stretch;
  border-bottom: 1px solid rgba(31, 36, 48, 0.08);
}

.plan-row:last-child {
  border-bottom: 0;
}

.plan-row span {
  display: flex;
  min-width: 0;
  align-items: center;
  padding: 8px 6px;
  border-right: 1px solid rgba(31, 36, 48, 0.08);
  color: var(--app-text);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.25;
  word-break: keep-all;
}

.plan-row span:last-child {
  border-right: 0;
}

.plan-head {
  min-height: 50px;
  background: #f7f8fc;
}

.plan-head span {
  color: #2a3040;
  font-size: 12px;
  font-weight: 800;
}

.plan-row.featured {
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
}

.plan-row.featured span {
  font-weight: 800;
}

.plan-name {
  flex-wrap: wrap;
  gap: 4px;
}

.plan-name em {
  display: inline-flex;
  height: 18px;
  align-items: center;
  padding: 0 6px;
  border-radius: 999px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #ffffff;
  font-size: 10px;
  font-style: normal;
  font-weight: 700;
}
</style>

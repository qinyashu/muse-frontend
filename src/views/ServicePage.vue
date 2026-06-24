<script setup>
import { useRouter } from 'vue-router'

import customerQrUrl from '../assets/customer-service-qr.png'

const router = useRouter()
</script>

<template>
  <div class="mobile-page service-page">
    <van-nav-bar class="page-nav" title="在线客服" left-arrow @click-left="router.back()" />

    <main class="page-body service-body">
      <section class="service-card app-card">
        <h1>添加在线客服</h1>
        <p>扫码添加客服微信，充值、售后和使用问题都可以联系。</p>

        <div class="qr-wrap">
          <img :src="customerQrUrl" alt="在线客服二维码" />
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.service-body {
  display: flex;
  align-items: flex-start;
}

.service-card {
  width: 100%;
  text-align: center;
}

.service-card h1 {
  margin: 0;
  color: var(--app-text);
  font-size: 22px;
  line-height: 1.25;
}

.service-card p {
  margin: 8px 0 18px;
  color: var(--app-muted);
  font-size: 13px;
  line-height: 1.6;
}

.qr-wrap {
  overflow: hidden;
  border-radius: 14px;
  background: #ffffff;
}

.qr-wrap img {
  display: block;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}
</style>

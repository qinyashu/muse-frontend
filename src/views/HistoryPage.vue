<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="history-screen">
    <figure class="history-stage">
      <img class="reference-page" src="/ref-history.jpg" alt="我的创作记录" draggable="false" />

      <button class="hotspot back-hotspot" type="button" aria-label="返回首页" @click="router.push('/')" />
      <button class="hotspot refresh-hotspot" type="button" aria-label="刷新" @click="router.go(0)" />
      <button class="hotspot running-card-hotspot" type="button" aria-label="进行中的任务" @click="router.push('/task/1')" />
      <button class="hotspot done-card-hotspot first" type="button" aria-label="已完成任务" @click="router.push('/task/2')" />
      <button class="hotspot done-card-hotspot second" type="button" aria-label="已完成任务" @click="router.push('/task/3')" />
      <button class="hotspot done-card-hotspot third" type="button" aria-label="已完成任务" @click="router.push('/task/4')" />
    </figure>
  </div>
</template>

<style scoped>
.history-screen {
  min-height: 100dvh;
  background: #020208;
  overflow-x: hidden;
}

.history-stage {
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

.hotspot {
  position: absolute;
  z-index: 2;
  display: block;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.back-hotspot {
  top: 2.2%;
  left: 3.2%;
  width: 26%;
  height: 4.8%;
}

.refresh-hotspot {
  top: 2.4%;
  right: 5.2%;
  width: 9.6%;
  height: 5.6%;
  border-radius: 16px;
}

.running-card-hotspot {
  top: 23.4%;
  left: 4.7%;
  width: 90.6%;
  height: 25.5%;
  border-radius: 22px;
}

.done-card-hotspot {
  left: 4.7%;
  width: 90.6%;
  height: 13.6%;
  border-radius: 18px;
}

.done-card-hotspot.first {
  top: 50.2%;
}

.done-card-hotspot.second {
  top: 65.1%;
}

.done-card-hotspot.third {
  top: 80.4%;
}
</style>

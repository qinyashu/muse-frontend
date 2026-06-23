<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 这里后续接后端列表接口；当前先用一组示例卡片复刻参考页结构
const tasks = [
  {
    id: 1,
    type: 'AI跳舞MV',
    status: '生成中',
    title: '动感街舞卡点视频',
    time: '2024-05-07 14:30',
    progress: 45,
  },
  {
    id: 2,
    type: 'AI唱歌MV',
    status: '已完成',
    title: '潮流说唱MV',
    time: '2024-05-06 20:15',
    progress: 100,
  },
  {
    id: 3,
    type: 'AI跳舞MV',
    status: '已完成',
    title: '活力跳舞挑战',
    time: '2024-05-05 18:42',
    progress: 100,
  },
]
</script>

<template>
  <div class="page history-page">
    <div class="history-topbar">
      <button class="back-link" type="button" @click="router.back()">← 返回首页</button>
      <button class="refresh-button" type="button" @click="router.go(0)">⟳</button>
    </div>

    <h1 class="history-title">我的创作记录</h1>

    <div class="history-summary">
      <span class="dot"></span>
      <span>进行中 1</span>
      <span class="divider">|</span>
      <span>已完成 8</span>
    </div>

    <div class="history-tabs">
      <button class="tab active" type="button">全部</button>
      <button class="tab" type="button">AI唱歌MV</button>
      <button class="tab" type="button">AI跳舞MV</button>
      <button class="tab" type="button">其他</button>
    </div>

    <section class="task-list">
      <article v-for="task in tasks" :key="task.id" class="task-card">
        <div class="task-badge">{{ task.type }}</div>
        <div class="task-cover">
          <div class="play">▶</div>
          <div class="duration">{{ task.progress === 45 ? '45%' : task.id === 2 ? '00:28' : '00:24' }}</div>
        </div>
        <div class="task-info">
          <div class="task-status" :class="{ running: task.status === '生成中' }">{{ task.status }}</div>
          <div class="task-name">{{ task.title }}</div>
          <div class="task-time">完成时间：{{ task.time }}</div>

          <template v-if="task.status === '生成中'">
            <div class="progress-row">
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: `${task.progress}%` }"></div>
              </div>
              <div class="progress-text">{{ task.progress }}%</div>
            </div>
            <div class="running-hint">AI智能生成中，请稍候...</div>
            <button class="cancel-button" type="button">取消生成</button>
          </template>

          <template v-else>
            <div class="action-row">
              <button class="mini-button" type="button">下载</button>
              <button class="mini-button" type="button">复制地址</button>
              <button class="more-button" type="button">⋮</button>
            </div>
          </template>
        </div>
      </article>
    </section>

    <div class="history-footer">内容仅自己可见，请放心使用</div>
  </div>
</template>

<style scoped>
.history-page {
  min-height: 100dvh;
  padding: 14px 16px 24px;
  background:
    radial-gradient(circle at top right, rgba(92, 56, 255, 0.22), transparent 24%),
    radial-gradient(circle at top left, rgba(0, 210, 255, 0.12), transparent 20%),
    linear-gradient(180deg, #050513 0%, #03030a 45%, #020208 100%);
  color: #f6f8ff;
}

.history-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-link,
.refresh-button {
  border: 0;
  background: transparent;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
}

.refresh-button {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  border: 1px solid rgba(148, 115, 255, 0.55);
  background: linear-gradient(180deg, rgba(25, 29, 68, 0.95), rgba(12, 13, 31, 0.98));
  box-shadow: 0 0 18px rgba(143, 70, 255, 0.25);
}

.history-title {
  margin: 18px 0 10px;
  font-size: 28px;
  line-height: 1.1;
  font-weight: 900;
}

.history-summary {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(228, 233, 255, 0.82);
  font-size: 15px;
}

.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #2f7dff;
  box-shadow: 0 0 12px rgba(66, 161, 255, 0.75);
}

.divider {
  color: rgba(142, 149, 177, 0.75);
}

.history-tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 18px;
}

.tab {
  height: 40px;
  border-radius: 14px;
  border: 0;
  background: linear-gradient(180deg, rgba(21, 23, 45, 0.98), rgba(12, 13, 29, 0.98));
  color: rgba(214, 220, 241, 0.82);
  font-size: 14px;
  font-weight: 700;
}

.tab.active {
  color: #fff;
  background: linear-gradient(90deg, rgba(94, 73, 255, 0.9), rgba(41, 120, 255, 0.95));
  box-shadow: 0 0 18px rgba(106, 95, 255, 0.24);
}

.task-list {
  display: grid;
  gap: 12px;
  margin-top: 18px;
}

.task-card {
  position: relative;
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 14px;
  padding: 12px;
  border-radius: 20px;
  border: 1px solid rgba(114, 117, 197, 0.3);
  background: linear-gradient(180deg, rgba(17, 18, 42, 0.96), rgba(9, 10, 24, 0.98));
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.34);
}

.task-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255, 91, 221, 0.72), rgba(49, 226, 255, 0.65));
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
  pointer-events: none;
  opacity: 0.72;
}

.task-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 6px 10px;
  border-radius: 10px 0 12px 0;
  background: linear-gradient(90deg, rgba(95, 80, 255, 0.92), rgba(54, 127, 255, 0.88));
  color: #dfe8ff;
  font-size: 12px;
  font-weight: 700;
}

.task-cover {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(28, 32, 56, 0.98), rgba(17, 20, 36, 0.98));
  overflow: hidden;
}

.play {
  width: 0;
  height: 0;
  border-top: 18px solid transparent;
  border-bottom: 18px solid transparent;
  border-left: 30px solid #fff;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.18));
}

.duration {
  position: absolute;
  right: 10px;
  bottom: 10px;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
}

.task-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.task-status {
  color: #bb7cff;
  font-size: 15px;
  font-weight: 800;
}

.task-status.running {
  color: #8a6cff;
}

.task-name {
  margin-top: 8px;
  font-size: 22px;
  font-weight: 800;
  line-height: 1.2;
}

.task-time {
  margin-top: 8px;
  color: rgba(210, 216, 236, 0.72);
  font-size: 14px;
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
}

.progress-track {
  flex: 1;
  height: 12px;
  border-radius: 999px;
  background: rgba(38, 42, 66, 0.9);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #e96ef7 0%, #5f7bff 45%, #37d9ff 100%);
}

.progress-text {
  width: 44px;
  text-align: right;
  font-size: 14px;
  color: #fff;
  font-weight: 700;
}

.running-hint {
  margin-top: 10px;
  color: rgba(199, 205, 224, 0.76);
  font-size: 14px;
}

.cancel-button {
  margin-top: 14px;
  height: 42px;
  border-radius: 14px;
  border: 1px solid rgba(133, 126, 255, 0.7);
  background: transparent;
  color: #83a7ff;
  font-size: 18px;
  font-weight: 800;
}

.action-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
}

.mini-button {
  height: 38px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid rgba(109, 123, 255, 0.55);
  background: rgba(14, 16, 36, 0.8);
  color: #9ad0ff;
  font-size: 14px;
  font-weight: 700;
}

.more-button {
  margin-left: auto;
  border: 0;
  background: transparent;
  color: rgba(218, 223, 240, 0.76);
  font-size: 26px;
  line-height: 1;
}

.history-footer {
  margin: 18px 0 0;
  text-align: center;
  color: rgba(166, 173, 198, 0.72);
  font-size: 13px;
}
</style>

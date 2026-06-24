<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const companyName = '百色合策互联网工作室'
const companyAddress = '百色市右江区城北一路29号金都美食城 二期 A段商务楼第8层815号'

const legalType = computed(() => (route.params.type === 'privacy' ? 'privacy' : 'user'))
const pageTitle = computed(() => (legalType.value === 'privacy' ? '隐私政策' : '用户协议'))
const updatedAt = '2026年6月24日'

const userSections = [
  {
    title: '一、服务说明',
    body: `本协议由你与${companyName}共同订立。我们提供基于人工智能的视频生成、图片上传、链接解析、任务处理、作品查看等相关服务。你使用本服务即表示已阅读并同意本协议。`,
  },
  {
    title: '二、账号与使用',
    body: '你应确保提交的手机号、图片、链接及其他资料真实、合法、有效，不得将服务用于违法违规、侵权、欺诈、骚扰、低俗或其他不当用途。',
  },
  {
    title: '三、内容与授权',
    body: '你应保证上传的照片、音视频链接及生成需求已取得必要授权。为完成生成任务，你同意我们在服务范围内对你提交的素材进行上传、缓存、处理、生成和展示。',
  },
  {
    title: '四、充值与次数',
    body: '平台可能提供会员、充值次数或其他付费能力。具体价格、次数、有效期和使用规则以页面展示为准。',
  },
  {
    title: '五、联系我们',
    body: `公司名称：${companyName}。联系地址：${companyAddress}。如你对本协议或服务有疑问，可通过平台在线客服与我们联系。`,
  },
]

const privacySections = [
  {
    title: '一、我们收集的信息',
    body: '为提供服务，我们可能收集你的设备标识、手机号、上传照片、抖音或其他视频链接、生成任务记录、访问日志和错误日志等必要信息。',
  },
  {
    title: '二、信息使用目的',
    body: '我们使用上述信息用于账号识别、剩余次数同步、任务创建、AI生成、结果展示、客服处理、风控安全、故障排查和服务优化。',
  },
  {
    title: '三、第三方服务',
    body: '为完成视频生成、文件存储、接口部署和访问加速，我们可能使用云存储、云服务器、AI模型服务和第三方视频解析服务。',
  },
  {
    title: '四、信息保护',
    body: '我们会采取合理的技术和管理措施保护你的信息安全，并在法律法规要求或你提出合法请求时依法处理相关信息。',
  },
  {
    title: '五、联系方式',
    body: `个人信息处理者：${companyName}。联系地址：${companyAddress}。如你对隐私政策有疑问，可通过平台在线客服联系我们。`,
  },
]

const sections = computed(() => (legalType.value === 'privacy' ? privacySections : userSections))
</script>

<template>
  <div class="mobile-page legal-page">
    <van-nav-bar class="page-nav" :title="pageTitle" left-arrow @click-left="router.back()" />

    <main class="page-body legal-body">
      <section class="legal-card app-card">
        <h1>{{ pageTitle }}</h1>
        <p class="meta">更新日期：{{ updatedAt }}</p>

        <article v-for="section in sections" :key="section.title" class="legal-section">
          <h2>{{ section.title }}</h2>
          <p>{{ section.body }}</p>
        </article>
      </section>
    </main>
  </div>
</template>

<style scoped>
.legal-card h1 {
  margin: 0;
  font-size: 22px;
}

.meta {
  margin: 8px 0 18px;
  color: var(--app-muted);
  font-size: 12px;
}

.legal-section + .legal-section {
  margin-top: 18px;
}

.legal-section h2 {
  margin: 0 0 8px;
  font-size: 16px;
}

.legal-section p {
  margin: 0;
  color: #4c5365;
  font-size: 14px;
  line-height: 1.75;
}
</style>

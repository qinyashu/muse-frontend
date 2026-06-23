import axios from 'axios'

// 后端地址从 Vite 环境变量读取，未配置时连接本地 FastAPI。
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8000',
  timeout: 30000,
})

// 注册设备用户，返回 axios Promise。
export function registerUser(deviceId) {
  return request.post('/api/user/register', { device_id: deviceId })
}

// 查询用户剩余次数，返回 axios Promise。
export function getUserInfo(deviceId) {
  return request.get('/api/user/info', {
    params: { device_id: deviceId },
  })
}

// 创建生成任务；sourceVideoFile 可选，用于抖音解析失败时上传本地视频兜底。
export function createTask(deviceId, type, douyinUrl, photoFile, sourceVideoFile = null) {
  const formData = new FormData()
  formData.append('device_id', deviceId)
  formData.append('type', type)
  formData.append('douyin_url', douyinUrl || '')
  formData.append('photo', photoFile)

  if (sourceVideoFile) {
    formData.append('source_video', sourceVideoFile)
  }

  return request.post('/api/task/create', formData)
}

// 查询任务状态和结果视频地址，返回 axios Promise。
export function getTaskStatus(taskId) {
  return request.get('/api/task/status', {
    params: { task_id: taskId },
  })
}

// 查询当前设备的真实创作记录，历史页只展示后端返回的任务
export function getTaskList(deviceId) {
  return request.get('/api/task/list', {
    params: { device_id: deviceId },
  })
}

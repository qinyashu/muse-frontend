import axios from 'axios'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8000',
  timeout: 30000,
})

export function loginAccount(phone, password) {
  return request.post('/api/auth/login', { phone, password })
}

export function registerAccount(phone, password) {
  return request.post('/api/auth/register', { phone, password })
}

export function registerUser(deviceId) {
  return request.post('/api/user/register', { device_id: deviceId })
}

export function getUserInfo(deviceId) {
  return request.get('/api/user/info', {
    params: { device_id: deviceId },
  })
}

export function getHotVideos() {
  return request.get('/api/hot-videos')
}

export function createTask(deviceId, type, douyinUrl, photoFile, sourceVideoFile = null) {
  const formData = new FormData()
  formData.append('device_id', deviceId)
  formData.append('type', type)
  formData.append('douyin_url', douyinUrl || '')
  formData.append('photo', photoFile)

  if (sourceVideoFile) {
    formData.append('source_video', sourceVideoFile)
  }

  return request.post('/api/task/create', formData, {
    timeout: 600000,
  })
}

export function getTaskStatus(taskId) {
  return request.get('/api/task/status', {
    params: { task_id: taskId },
  })
}

export function getTaskList(deviceId) {
  return request.get('/api/task/list', {
    params: { device_id: deviceId },
  })
}

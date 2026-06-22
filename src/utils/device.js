const DEVICE_ID_KEY = 'device_id'

// 生成浏览器端设备 UUID，优先使用原生 crypto.randomUUID。
function generateUuid() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID()
  }

  return `device_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

// 从 localStorage 获取设备唯一 ID；不存在时创建并保存。
export function getDeviceId() {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY)
  if (!deviceId) {
    deviceId = generateUuid()
    localStorage.setItem(DEVICE_ID_KEY, deviceId)
  }
  return deviceId
}

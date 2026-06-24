const AUTH_KEY = 'muse_auth_ok'
const PHONE_KEY = 'muse_auth_phone'
const UNLIMITED_KEY = 'muse_auth_unlimited'

export function isAuthed() {
  return localStorage.getItem(AUTH_KEY) === '1'
}

export function saveAuth(user = {}) {
  localStorage.setItem(AUTH_KEY, '1')

  if (user.phone) {
    localStorage.setItem(PHONE_KEY, user.phone)
  }

  if (user.device_id) {
    localStorage.setItem('device_id', user.device_id)
  }

  if (user.is_unlimited) {
    localStorage.setItem(UNLIMITED_KEY, '1')
  } else {
    localStorage.removeItem(UNLIMITED_KEY)
  }
}

export function getAuthPhone() {
  return localStorage.getItem(PHONE_KEY) || ''
}

export function isUnlimitedAccount() {
  return localStorage.getItem(UNLIMITED_KEY) === '1'
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY)
  localStorage.removeItem(PHONE_KEY)
  localStorage.removeItem(UNLIMITED_KEY)
  localStorage.removeItem('device_id')
  localStorage.removeItem('muse_vip_mark')
}

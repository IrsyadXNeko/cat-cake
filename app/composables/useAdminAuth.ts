import type { AdminSession, AdminCredentials } from '~/types'

// Simple simulated auth — in production use proper JWT/session
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'catcake2024'

const session = reactive<AdminSession>({
  isAuthenticated: false,
  username: null,
})

export function useAdminAuth() {
  function login(credentials: AdminCredentials): boolean {
    if (
      credentials.username === ADMIN_USERNAME &&
      credentials.password === ADMIN_PASSWORD
    ) {
      session.isAuthenticated = true
      session.username = credentials.username
      // Persist across page refresh via sessionStorage
      if (import.meta.client) {
        sessionStorage.setItem('admin_auth', 'true')
        sessionStorage.setItem('admin_user', credentials.username)
      }
      return true
    }
    return false
  }

  function logout(): void {
    session.isAuthenticated = false
    session.username = null
    if (import.meta.client) {
      sessionStorage.removeItem('admin_auth')
      sessionStorage.removeItem('admin_user')
    }
  }

  function restoreSession(): void {
    if (import.meta.client) {
      const stored = sessionStorage.getItem('admin_auth')
      const user = sessionStorage.getItem('admin_user')
      if (stored === 'true' && user) {
        session.isAuthenticated = true
        session.username = user
      }
    }
  }

  return {
    session: readonly(session),
    login,
    logout,
    restoreSession,
  }
}

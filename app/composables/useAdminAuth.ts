import type { AdminSession, AdminCredentials } from '~/types'

const session = reactive<AdminSession>({
  isAuthenticated: false,
  username: null,
})

export function useAdminAuth() {
  const config = useRuntimeConfig()
  const ADMIN_USERNAME = config.public.adminUsername
  const ADMIN_PASSWORD = config.public.adminPassword
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

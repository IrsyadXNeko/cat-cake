import type { Menu, MenuFormData } from '~/types'

export function useMenu() {
  const menus = ref<Menu[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)

  async function fetchMenus(): Promise<void> {
    pending.value = true
    error.value = null
    try {
      const data = await $fetch<Menu[]>('/api/menu')
      menus.value = data
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : 'Failed to load menus'
    } finally {
      pending.value = false
    }
  }

  async function createMenu(form: MenuFormData): Promise<Menu> {
    const created = await $fetch<Menu>('/api/menu', {
      method: 'POST',
      body: form,
    })
    menus.value.push(created)
    return created
  }

  async function updateMenu(id: string, form: Partial<MenuFormData>): Promise<Menu> {
    const updated = await $fetch<Menu>(`/api/menu/${id}`, {
      method: 'PUT',
      body: form,
    })
    const idx = menus.value.findIndex((m) => m.id === id)
    if (idx !== -1) menus.value[idx] = updated
    return updated
  }

  async function toggleAvailability(id: string, is_available: boolean): Promise<Menu> {
    return updateMenu(id, { is_available })
  }

  async function deleteMenu(id: string): Promise<void> {
    await $fetch(`/api/menu/${id}`, { method: 'DELETE' })
    menus.value = menus.value.filter((m) => m.id !== id)
  }

  return {
    menus,
    pending,
    error,
    fetchMenus,
    createMenu,
    updateMenu,
    toggleAvailability,
    deleteMenu,
  }
}

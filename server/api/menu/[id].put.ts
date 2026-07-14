import type { Menu, MenuFormData } from '../../../app/types'
import { getMenusFromStorage, saveMenusToStorage } from '../../utils/menuStorage'

export default defineEventHandler(async (event): Promise<Menu> => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Menu ID is required' })
  }

  const body = await readBody<Partial<MenuFormData>>(event)
  const menus = await getMenusFromStorage()

  const idx = menus.findIndex((m) => m.id === id)
  if (idx === -1) {
    throw createError({ statusCode: 404, message: `Menu item ${id} not found` })
  }

  const updated: Menu = {
    ...menus[idx]!,
  }

  if (body.name !== undefined) updated.name = body.name
  if (body.description !== undefined) updated.description = body.description
  if (body.price !== undefined) updated.price = body.price
  if (body.category !== undefined) updated.category = body.category
  if (body.image_url !== undefined) updated.image_url = body.image_url
  if (body.is_available !== undefined) updated.is_available = body.is_available

  updated.updated_at = new Date().toISOString()

  menus[idx] = updated
  await saveMenusToStorage(menus)

  return updated
})
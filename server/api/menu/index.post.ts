import type { Menu, MenuFormData } from '../../../app/types'
import { getMenusFromStorage, saveMenusToStorage } from '../../utils/menuStorage'

export default defineEventHandler(async (event): Promise<Menu> => {
  const body = await readBody<MenuFormData>(event)

  if (!body.name || !body.category || body.price === undefined) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: name, category, price',
    })
  }

  const menus = await getMenusFromStorage()

  const newMenu: Menu = {
    id: crypto.randomUUID(),
    name: body.name.trim(),
    description: body.description?.trim() ?? '',
    price: Number(body.price),
    category: body.category,
    image_url: body.image_url?.trim() ?? '',
    is_available: body.is_available ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  menus.push(newMenu)
  await saveMenusToStorage(menus)

  return newMenu
})

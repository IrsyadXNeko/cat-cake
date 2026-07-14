import { getMenusFromStorage, saveMenusToStorage } from '../../utils/menuStorage'

export default defineEventHandler(async (event): Promise<{ message: string }> => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Menu ID is required' })
  }

  const menus = await getMenusFromStorage()
  const idx = menus.findIndex((m) => m.id === id)

  if (idx === -1) {
    throw createError({ statusCode: 404, message: `Menu item ${id} not found` })
  }

  menus.splice(idx, 1)
  await saveMenusToStorage(menus)

  return { message: `Menu item ${id} deleted successfully` }
})

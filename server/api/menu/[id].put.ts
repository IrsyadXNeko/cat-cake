import type { Menu, MenuFormData } from '../../../app/types'
import { updateMenuInStorage } from '../../utils/menuStorage'

export default defineEventHandler(async (event): Promise<Menu> => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Menu ID is required' })
  }

  const body = await readBody<Partial<MenuFormData>>(event)
  return await updateMenuInStorage(id, body)
})
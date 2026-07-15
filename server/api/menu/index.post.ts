import type { Menu, MenuFormData } from '../../../app/types'
import { createMenuInStorage } from '../../utils/menuStorage'

export default defineEventHandler(async (event): Promise<Menu> => {
  const body = await readBody<MenuFormData>(event)

  if (!body.name || !body.category || body.price === undefined) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: name, category, price',
    })
  }

  return await createMenuInStorage(body)
})

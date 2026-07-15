import { deleteMenuFromStorage } from '../../utils/menuStorage'

export default defineEventHandler(async (event): Promise<{ message: string }> => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Menu ID is required' })
  }

  await deleteMenuFromStorage(id)

  return { message: `Menu item ${id} deleted successfully` }
})

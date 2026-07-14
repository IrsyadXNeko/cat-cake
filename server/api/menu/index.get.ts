import type { Menu } from '../../../app/types'
import { getMenusFromStorage } from '../../utils/menuStorage'

export default defineEventHandler(async (): Promise<Menu[]> => {
  const menus = await getMenusFromStorage()
  return menus
})

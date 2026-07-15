import type { Menu, MenuFormData } from '../../app/types'

const TABLE = 'menu_items'

export async function getMenusFromStorage(): Promise<Menu[]> {
  const supabase = useSupabase()
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    throw createError({ statusCode: 500, message: `Failed to fetch menus: ${error.message}` })
  }

  return data as Menu[]
}

export async function createMenuInStorage(form: MenuFormData): Promise<Menu> {
  const supabase = useSupabase()
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      name: form.name.trim(),
      description: form.description?.trim() ?? '',
      price: Number(form.price),
      category: form.category,
      image_url: form.image_url?.trim() ?? '',
      is_available: form.is_available ?? true,
    })
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, message: `Failed to create menu: ${error.message}` })
  }

  return data as Menu
}

export async function updateMenuInStorage(id: string, form: Partial<MenuFormData>): Promise<Menu> {
  const supabase = useSupabase()
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      ...(form.name !== undefined && { name: form.name.trim() }),
      ...(form.description !== undefined && { description: form.description.trim() }),
      ...(form.price !== undefined && { price: Number(form.price) }),
      ...(form.category !== undefined && { category: form.category }),
      ...(form.image_url !== undefined && { image_url: form.image_url.trim() }),
      ...(form.is_available !== undefined && { is_available: form.is_available }),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      throw createError({ statusCode: 404, message: `Menu item ${id} not found` })
    }
    throw createError({ statusCode: 500, message: `Failed to update menu: ${error.message}` })
  }

  return data as Menu
}

export async function deleteMenuFromStorage(id: string): Promise<void> {
  const supabase = useSupabase()
  const { error, count } = await supabase
    .from(TABLE)
    .delete({ count: 'exact' })
    .eq('id', id)

  if (error) {
    throw createError({ statusCode: 500, message: `Failed to delete menu: ${error.message}` })
  }

  if (count === 0) {
    throw createError({ statusCode: 404, message: `Menu item ${id} not found` })
  }
}

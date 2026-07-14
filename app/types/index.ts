// ─── Menu Domain Types ─────────────────────────────────────────────────────

export interface Menu {
  id: string
  name: string
  description: string
  price: number
  category: MenuCategory
  image_url: string
  is_available: boolean
  created_at?: string
  updated_at?: string
}

export type MenuCategory =
  | 'Bolu'
  | 'Cheese Cake'
  | 'Fluffy Pancake'
  | 'Mini Pancake'
  | 'Add-ons & Drinks'

export const MENU_CATEGORIES: MenuCategory[] = [
  'Bolu',
  'Cheese Cake',
  'Fluffy Pancake',
  'Mini Pancake',
  'Add-ons & Drinks',
]

// ─── API Response Types ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  statusCode: number
  message: string
}

// ─── Form Types ────────────────────────────────────────────────────────────

export type MenuFormData = Omit<Menu, 'id' | 'created_at' | 'updated_at'>

// ─── Admin Auth Types ──────────────────────────────────────────────────────

export interface AdminCredentials {
  username: string
  password: string
}

export interface AdminSession {
  isAuthenticated: boolean
  username: string | null
}

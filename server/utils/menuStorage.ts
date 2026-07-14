import type { Menu } from '../../app/types'

// ─── Seed Data ─────────────────────────────────────────────────────────────

export const SEED_MENUS: Menu[] = [
  {
    id: '1',
    name: 'Bolu Coklat',
    description: 'Fluffy steamed chocolate sponge cake with rich cocoa aroma',
    price: 45000,
    category: 'Bolu',
    image_url: 'https://picsum.photos/seed/bolu-coklat/400/300',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Bolu Pandan',
    description: 'Traditional pandan-infused steamed sponge with natural green color',
    price: 40000,
    category: 'Bolu',
    image_url: 'https://picsum.photos/seed/bolu-pandan/400/300',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'New York Cheese Cake',
    description: 'Classic dense and creamy New York-style cheesecake on a buttery graham crust',
    price: 85000,
    category: 'Cheese Cake',
    image_url: 'https://picsum.photos/seed/newyork-cheesecake/400/300',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Matcha Cheese Cake',
    description: 'Velvety Japanese matcha cheesecake with a delicate earthy sweetness',
    price: 90000,
    category: 'Cheese Cake',
    image_url: 'https://picsum.photos/seed/matcha-cheese/400/300',
    is_available: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Fluffy Pancake Original',
    description: 'Tall and jiggly Japanese soufflé pancake, light as a cloud',
    price: 55000,
    category: 'Fluffy Pancake',
    image_url: 'https://picsum.photos/seed/fluffy-pancake/400/300',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Fluffy Pancake Strawberry',
    description: 'Soufflé pancake topped with fresh strawberries and whipped cream',
    price: 65000,
    category: 'Fluffy Pancake',
    image_url: 'https://picsum.photos/seed/fluffy-strawberry/400/300',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Mini Pancake Original',
    description: 'Bite-sized fluffy mini pancakes — perfect for sharing or snacking',
    price: 35000,
    category: 'Mini Pancake',
    image_url: 'https://picsum.photos/seed/mini-pancake/400/300',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Fruit Tacos Mini Pancake',
    description: 'Mini pancake tacos filled with seasonal fruits and cream cheese',
    price: 45000,
    category: 'Mini Pancake',
    image_url: 'https://picsum.photos/seed/fruit-tacos/400/300',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Iced Latte',
    description: 'Cold-brewed espresso with fresh milk over ice — smooth and mellow',
    price: 28000,
    category: 'Add-ons & Drinks',
    image_url: 'https://picsum.photos/seed/iced-latte/400/300',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '10',
    name: 'Strawberry Fruit Ade',
    description: 'Refreshing sparkling strawberry ade with real fruit chunks',
    price: 25000,
    category: 'Add-ons & Drinks',
    image_url: 'https://picsum.photos/seed/strawberry-ade/400/300',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '11',
    name: 'Whipped Cream Add-on',
    description: 'Extra cloud-like whipped cream to top any treat',
    price: 8000,
    category: 'Add-ons & Drinks',
    image_url: 'https://picsum.photos/seed/whipped-cream/400/300',
    is_available: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// ─── Storage helpers ───────────────────────────────────────────────────────

const STORAGE_KEY = 'menus:data'

export async function getMenusFromStorage(): Promise<Menu[]> {
  const storage = useStorage('data')
  const stored = await storage.getItem<Menu[]>(STORAGE_KEY)
  if (!stored || stored.length === 0) {
    await storage.setItem(STORAGE_KEY, SEED_MENUS)
    return SEED_MENUS
  }
  return stored
}

export async function saveMenusToStorage(menus: Menu[]): Promise<void> {
  const storage = useStorage('data')
  await storage.setItem(STORAGE_KEY, menus)
}

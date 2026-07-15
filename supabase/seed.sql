-- ─── Seed data for menu_items ────────────────────────────────────────────
-- Run this in Supabase SQL Editor after migration 0001.

insert into menu_items (name, description, price, category, image_url, is_available) values
  ('Bolu Coklat',          'Fluffy steamed chocolate sponge cake with rich cocoa aroma',       45000, 'Bolu',              'https://picsum.photos/seed/bolu-coklat/400/300',           true),
  ('Bolu Pandan',          'Traditional pandan-infused steamed sponge with natural green color', 40000, 'Bolu',              'https://picsum.photos/seed/bolu-pandan/400/300',          true),
  ('New York Cheese Cake',  'Classic dense and creamy New York-style cheesecake on a buttery graham crust', 85000, 'Cheese Cake',  'https://picsum.photos/seed/newyork-cheesecake/400/300',   true),
  ('Matcha Cheese Cake',   'Velvety Japanese matcha cheesecake with a delicate earthy sweetness', 90000, 'Cheese Cake',      'https://picsum.photos/seed/matcha-cheese/400/300',        false),
  ('Fluffy Pancake Original', 'Tall and jiggly Japanese soufflé pancake, light as a cloud',    55000, 'Fluffy Pancake',    'https://picsum.photos/seed/fluffy-pancake/400/300',       true),
  ('Fluffy Pancake Strawberry', 'Soufflé pancake topped with fresh strawberries and whipped cream', 65000, 'Fluffy Pancake', 'https://picsum.photos/seed/fluffy-strawberry/400/300',    true),
  ('Mini Pancake Original',   'Bite-sized fluffy mini pancakes — perfect for sharing or snacking', 35000, 'Mini Pancake',   'https://picsum.photos/seed/mini-pancake/400/300',         true),
  ('Fruit Tacos Mini Pancake','Mini pancake tacos filled with seasonal fruits and cream cheese',  45000, 'Mini Pancake',    'https://picsum.photos/seed/fruit-tacos/400/300',          true),
  ('Iced Latte',           'Cold-brewed espresso with fresh milk over ice — smooth and mellow', 28000, 'Add-ons & Drinks',  'https://picsum.photos/seed/iced-latte/400/300',           true),
  ('Strawberry Fruit Ade',  'Refreshing sparkling strawberry ade with real fruit chunks',       25000, 'Add-ons & Drinks',  'https://picsum.photos/seed/strawberry-ade/400/300',       true),
  ('Whipped Cream Add-on',  'Extra cloud-like whipped cream to top any treat',                  8000, 'Add-ons & Drinks',  'https://picsum.photos/seed/whipped-cream/400/300',        true)
on conflict (id) do nothing;

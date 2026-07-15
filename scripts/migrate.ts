import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

async function main() {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error('Missing DATABASE_URL environment variable')
    console.error('Usage: DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres" node scripts/migrate.ts')
    process.exit(1)
  }

  const client = new pg.Client({ connectionString: dbUrl })
  await client.connect()
  console.log('Connected to Supabase database\n')

  try {
    // Run migration
    const migrationPath = resolve(root, 'supabase/migrations/0001_create_menus.sql')
    console.log(`Running migration: ${migrationPath}`)
    const migrationSql = readFileSync(migrationPath, 'utf-8')
    await client.query(migrationSql)
    console.log('Migration completed\n')

    // Run seed
    const seedPath = resolve(root, 'supabase/seed.sql')
    console.log(`Running seed: ${seedPath}`)
    const seedSql = readFileSync(seedPath, 'utf-8')
    await client.query(seedSql)
    console.log('Seed completed\n')

    // Verify
    const { rows } = await client.query('SELECT count(*)::int as count FROM menu_items')
    console.log(`Total menu_items in database: ${rows[0].count}`)
  } catch (err) {
    console.error('Error:', err instanceof Error ? err.message : err)
    process.exit(1)
  } finally {
    await client.end()
    console.log('Disconnected')
  }
}

main()

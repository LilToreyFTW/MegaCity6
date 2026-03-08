import { neon } from '@neondatabase/serverless'

const databaseUrl = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_h9vSUbw2kNWy@ep-square-cake-aklrmj4p-pooler.c-3.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set')
}

export const sql = neon(databaseUrl)

// Database connection test
export async function testConnection() {
  try {
    const result = await sql`SELECT version()`
    console.log('Database connected successfully:', result[0])
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

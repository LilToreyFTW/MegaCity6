import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

export const sql = neon(process.env.DATABASE_URL)

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

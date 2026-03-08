import { sql, testConnection } from '../../../lib/neon.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Test connection first
    const connected = await testConnection()
    if (!connected) {
      return res.status(500).json({ error: 'Database connection failed' })
    }

    // Read schema file
    const fs = require('fs')
    const path = require('path')
    const schemaPath = path.join(process.cwd(), 'lib', 'db-schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')

    // Execute schema
    await sql`${schema}`

    res.status(200).json({ 
      success: true, 
      message: 'Database schema created successfully' 
    })

  } catch (error) {
    console.error('Database setup error:', error)
    res.status(500).json({ 
      error: 'Failed to setup database', 
      details: error.message 
    })
  }
}

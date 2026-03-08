import { sql } from '../../../lib/neon.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { username, email, password } = req.body

    if (!username || username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' })
    }

    // Check if username already exists
    const existingPlayer = await sql`
      SELECT id FROM players WHERE username = ${username}
    `

    if (existingPlayer.length > 0) {
      return res.status(400).json({ error: 'Username already taken' })
    }

    // Create new player
    const newPlayer = await sql`
      INSERT INTO players (username, email, is_online, created_at)
      VALUES (${username}, ${email || null}, true, CURRENT_TIMESTAMP)
      RETURNING id, username, money, bank_money, level, experience, created_at
    `

    // Initialize player stats
    await sql`
      INSERT INTO game_stats (player_id, stat_name, stat_value)
      VALUES 
        (${newPlayer[0].id}, 'total_playtime', 0),
        (${newPlayer[0].id}, 'missions_completed', 0),
        (${newPlayer[0].id}, 'total_kills', 0),
        (${newPlayer[0].id}, 'deaths', 0)
    `

    // Initialize battle pass
    await sql`
      INSERT INTO battle_pass (player_id, current_tier, current_xp, season_number)
      VALUES (${newPlayer[0].id}, 1, 0, 1)
    `

    // Initialize weapons
    await sql`
      INSERT INTO player_weapons (player_id, weapon_type, ammo, unlocked)
      VALUES 
        (${newPlayer[0].id}, 'pistol', 999, true),
        (${newPlayer[0].id}, 'shotgun', 0, false),
        (${newPlayer[0].id}, 'rifle', 0, false),
        (${newPlayer[0].id}, 'smg', 0, false),
        (${newPlayer[0].id}, 'sniper', 0, false),
        (${newPlayer[0].id}, 'rpg', 0, false)
    `

    res.status(201).json({ 
      success: true, 
      player: newPlayer[0],
      message: 'Player registered successfully' 
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ 
      error: 'Registration failed', 
      details: error.message 
    })
  }
}

import { sql } from '../../../lib/neon.js'

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { username } = req.body

    if (!username) {
      return res.status(400).json({ error: 'Username is required' })
    }

    // Find player
    const player = await sql`
      SELECT id, username, money, bank_money, level, experience, health, armor, 
             wanted_level, current_weapon, position_x, position_y, position_z
      FROM players 
      WHERE username = ${username}
    `

    if (player.length === 0) {
      return res.status(404).json({ error: 'Player not found' })
    }

    // Get player stats
    const stats = await sql`
      SELECT stat_name, stat_value FROM game_stats WHERE player_id = ${player[0].id}
    `

    // Get battle pass info
    const battlePass = await sql`
      SELECT current_tier, current_xp, season_number, rewards_claimed
      FROM battle_pass WHERE player_id = ${player[0].id}
    `

    // Get weapons
    const weapons = await sql`
      SELECT weapon_type, ammo, unlocked FROM player_weapons WHERE player_id = ${player[0].id}
    `

    // Update last login and online status
    await sql`
      UPDATE players 
      SET last_login = CURRENT_TIMESTAMP, is_online = true
      WHERE id = ${player[0].id}
    `

    // Start game session
    await sql`
      INSERT INTO game_sessions (player_id, session_start)
      VALUES (${player[0].id})
    `

    const playerData = {
      ...player[0],
      stats: stats.reduce((acc, stat) => {
        acc[stat.stat_name] = stat.stat_value
        return acc
      }, {}),
      battlePass: battlePass[0] || { current_tier: 1, current_xp: 0, season_number: 1 },
      weapons: weapons.reduce((acc, weapon) => {
        acc[weapon.weapon_type] = {
          ammo: weapon.ammo,
          unlocked: weapon.unlocked
        }
        return acc
      }, {})
    }

    res.status(200).json({ 
      success: true, 
      player: playerData,
      message: 'Login successful' 
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      error: 'Login failed', 
      details: error.message 
    })
  }
}

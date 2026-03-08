import { sql } from '../../../lib/neon.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { playerId, updates } = req.body

    if (!playerId || !updates) {
      return res.status(400).json({ error: 'Player ID and updates are required' })
    }

    // Build dynamic update query
    const updateFields = []
    const updateValues = []

    if (updates.money !== undefined) {
      updateFields.push(`money = $${updateValues.length + 1}`)
      updateValues.push(updates.money)
    }
    if (updates.bank_money !== undefined) {
      updateFields.push(`bank_money = $${updateValues.length + 1}`)
      updateValues.push(updates.bank_money)
    }
    if (updates.health !== undefined) {
      updateFields.push(`health = $${updateValues.length + 1}`)
      updateValues.push(updates.health)
    }
    if (updates.armor !== undefined) {
      updateFields.push(`armor = $${updateValues.length + 1}`)
      updateValues.push(updates.armor)
    }
    if (updates.wanted_level !== undefined) {
      updateFields.push(`wanted_level = $${updateValues.length + 1}`)
      updateValues.push(updates.wanted_level)
    }
    if (updates.current_weapon !== undefined) {
      updateFields.push(`current_weapon = $${updateValues.length + 1}`)
      updateValues.push(updates.current_weapon)
    }
    if (updates.level !== undefined) {
      updateFields.push(`level = $${updateValues.length + 1}`)
      updateValues.push(updates.level)
    }
    if (updates.experience !== undefined) {
      updateFields.push(`experience = $${updateValues.length + 1}`)
      updateValues.push(updates.experience)
    }
    if (updates.position_x !== undefined) {
      updateFields.push(`position_x = $${updateValues.length + 1}`)
      updateValues.push(updates.position_x)
    }
    if (updates.position_y !== undefined) {
      updateFields.push(`position_y = $${updateValues.length + 1}`)
      updateValues.push(updates.position_y)
    }
    if (updates.position_z !== undefined) {
      updateFields.push(`position_z = $${updateValues.length + 1}`)
      updateValues.push(updates.position_z)
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid update fields provided' })
    }

    // Add playerId to values
    updateValues.push(playerId)

    // Execute update
    const query = `
      UPDATE players 
      SET ${updateFields.join(', ')} 
      WHERE id = $${updateValues.length}
      RETURNING id, username, money, bank_money, health, armor, wanted_level, 
                current_weapon, level, experience, position_x, position_y, position_z
    `

    const result = await sql.query(query, updateValues)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Player not found' })
    }

    // Update stats if provided
    if (updates.stats) {
      for (const [statName, statValue] of Object.entries(updates.stats)) {
        await sql`
          INSERT INTO game_stats (player_id, stat_name, stat_value)
          VALUES (${playerId}, ${statName}, ${statValue})
          ON CONFLICT (player_id, stat_name) 
          DO UPDATE SET stat_value = ${statValue}, updated_at = CURRENT_TIMESTAMP
        `
      }
    }

    // Update weapons if provided
    if (updates.weapons) {
      for (const [weaponType, weaponData] of Object.entries(updates.weapons)) {
        await sql`
          UPDATE player_weapons 
          SET ammo = ${weaponData.ammo}, unlocked = ${weaponData.unlocked}
          WHERE player_id = ${playerId} AND weapon_type = ${weaponType}
        `
      }
    }

    res.status(200).json({ 
      success: true, 
      player: result.rows[0],
      message: 'Player updated successfully' 
    })

  } catch (error) {
    console.error('Player update error:', error)
    res.status(500).json({ 
      error: 'Update failed', 
      details: error.message 
    })
  }
}

import { sql } from '../../../../lib/neon.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { category = 'level', limit = 10 } = req.query

    const validCategories = ['level', 'money', 'experience', 'missions_completed', 'total_kills']
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' })
    }

    let query = ''
    let queryParams = []

    if (category === 'money') {
      query = `
        SELECT p.username, p.money as score, p.level, p.created_at
        FROM players p
        WHERE p.money > 0
        ORDER BY p.money DESC
        LIMIT $1
      `
      queryParams = [parseInt(limit)]
    } else if (category === 'level' || category === 'experience') {
      query = `
        SELECT p.username, p.${category} as score, p.money, p.created_at
        FROM players p
        ORDER BY p.${category} DESC
        LIMIT $1
      `
      queryParams = [parseInt(limit)]
    } else {
      query = `
        SELECT p.username, gs.stat_value as score, p.level, p.money
        FROM players p
        JOIN game_stats gs ON p.id = gs.player_id
        WHERE gs.stat_name = $1
        ORDER BY gs.stat_value DESC
        LIMIT $2
      `
      queryParams = [category, parseInt(limit)]
    }

    const leaderboard = await sql.query(query, queryParams)

    // Add rank positions
    const rankedLeaderboard = leaderboard.rows.map((row, index) => ({
      rank: index + 1,
      username: row.username,
      score: row.score,
      level: row.level,
      money: row.money || 0,
      created_at: row.created_at
    }))

    res.status(200).json({ 
      success: true, 
      category,
      leaderboard: rankedLeaderboard 
    })

  } catch (error) {
    console.error('Leaderboard error:', error)
    res.status(500).json({ 
      error: 'Failed to fetch leaderboard', 
      details: error.message 
    })
  }
}

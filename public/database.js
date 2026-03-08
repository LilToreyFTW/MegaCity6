// Database Manager for MegaCity6
class DatabaseManager {
    constructor() {
        this.baseURL = '/api'
        this.currentPlayer = null
        this.isOnline = false
    }

    // Player registration
    async registerPlayer(username, email = null) {
        try {
            const response = await fetch(`${this.baseURL}/players/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email })
            })

            const data = await response.json()
            
            if (data.success) {
                this.currentPlayer = data.player
                this.isOnline = true
                console.log('Player registered:', data.player)
                return data
            } else {
                // Check if database setup is required
                if (data.setupRequired) {
                    console.log('Database setup required, running setup...')
                    await this.setupDatabase()
                    // Retry registration after setup
                    return this.registerPlayer(username, email)
                }
                throw new Error(data.error || 'Registration failed')
            }
        } catch (error) {
            console.error('Registration error:', error)
            throw error
        }
    }

    // Player login
    async loginPlayer(username) {
        try {
            const response = await fetch(`${this.baseURL}/players/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username })
            })

            const data = await response.json()
            
            if (data.success) {
                this.currentPlayer = data.player
                this.isOnline = true
                console.log('Player logged in:', data.player)
                return data
            } else {
                // Check if database setup is required
                if (data.setupRequired) {
                    console.log('Database setup required, running setup...')
                    await this.setupDatabase()
                    // Retry login after setup
                    return this.loginPlayer(username)
                }
                throw new Error(data.error || 'Login failed')
            }
        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    }

    // Update player data
    async updatePlayer(updates) {
        if (!this.currentPlayer || !this.isOnline) {
            throw new Error('No player logged in')
        }

        try {
            const response = await fetch(`${this.baseURL}/players/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    playerId: this.currentPlayer.id, 
                    updates 
                })
            })

            const data = await response.json()
            
            if (data.success) {
                // Update local player data
                this.currentPlayer = { ...this.currentPlayer, ...data.player }
                console.log('Player updated:', data.player)
                return data
            } else {
                throw new Error(data.error || 'Update failed')
            }
        } catch (error) {
            console.error('Update error:', error)
            throw error
        }
    }

    // Get leaderboard
    async getLeaderboard(category = 'level', limit = 10) {
        try {
            const response = await fetch(`${this.baseURL}/leaderboard/get?category=${category}&limit=${limit}`)
            const data = await response.json()
            
            if (data.success) {
                return data.leaderboard
            } else {
                throw new Error(data.error || 'Failed to fetch leaderboard')
            }
        } catch (error) {
            console.error('Leaderboard error:', error)
            throw error
        }
    }

    // Setup database
    async setupDatabase() {
        try {
            const response = await fetch(`${this.baseURL}/database/setup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            const data = await response.json()
            
            if (data.success) {
                console.log('Database setup completed:', data.message)
                return data
            } else {
                throw new Error(data.error || 'Database setup failed')
            }
        } catch (error) {
            console.error('Database setup error:', error)
            throw error
        }
    }

    // Auto-save player position and stats
    async autoSave() {
        if (!this.currentPlayer || !this.isOnline || !window.game) {
            return
        }

        const game = window.game
        const updates = {
            position_x: game.vehicle ? game.vehicle.position.x : 0,
            position_y: game.vehicle ? game.vehicle.position.y : 0,
            position_z: game.vehicle ? game.vehicle.position.z : 0,
            health: game.characterHealth || 100,
            armor: game.characterArmor || 0,
            wanted_level: game.wantedLevel || 0,
            current_weapon: game.currentWeapon || 'pistol',
            money: game.money || 1000,
            bank_money: game.bankMoney || 5000,
            level: Math.floor((game.experience || 0) / 1000) + 1,
            experience: game.experience || 0,
            stats: {
                total_playtime: Math.floor(Date.now() / 1000) - (this.currentPlayer.created_at ? new Date(this.currentPlayer.created_at).getTime() / 1000 : 0),
                missions_completed: game.missionsCompleted || 0,
                total_kills: game.totalKills || 0,
                deaths: game.deaths || 0
            }
        }

        try {
            await this.updatePlayer(updates)
            console.log('Auto-saved player data')
        } catch (error) {
            console.error('Auto-save failed:', error)
        }
    }

    // Start auto-save interval
    startAutoSave(intervalMs = 30000) { // Auto-save every 30 seconds
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval)
        }

        this.autoSaveInterval = setInterval(() => {
            this.autoSave()
        }, intervalMs)

        console.log('Auto-save started')
    }

    // Stop auto-save
    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval)
            this.autoSaveInterval = null
            console.log('Auto-save stopped')
        }
    }

    // Logout
    logout() {
        this.stopAutoSave()
        this.currentPlayer = null
        this.isOnline = false
        console.log('Player logged out')
    }

    // Get current player
    getCurrentPlayer() {
        return this.currentPlayer
    }

    // Check if online
    isPlayerOnline() {
        return this.isOnline
    }
}

// Initialize database manager
if (typeof window !== 'undefined') {
    window.gameDatabase = new DatabaseManager()
}

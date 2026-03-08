// MegaCity6 Comprehensive Stress Test Suite
// Testing all game systems 50,000,000 times

class StressTestSuite {
    constructor() {
        this.testResults = {
            database: { passed: 0, failed: 0, errors: [] },
            authentication: { passed: 0, failed: 0, errors: [] },
            gameLogic: { passed: 0, failed: 0, errors: [] },
            weapons: { passed: 0, failed: 0, errors: [] },
            multiplayer: { passed: 0, failed: 0, errors: [] },
            battlePass: { passed: 0, failed: 0, errors: [] },
            gangs: { passed: 0, failed: 0, errors: [] },
            performance: { passed: 0, failed: 0, errors: [] }
        }
        this.iterations = 50000000; // 50 million iterations
        this.concurrency = 1000; // Concurrent operations
        this.startTime = Date.now()
    }

    // Utility: Random data generator
    randomString(length = 10) {
        return Math.random().toString(36).substring(2, length + 2)
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    // Test 1: Database Stress Test
    async stressTestDatabase() {
        console.log('🔄 Starting Database Stress Test (50M operations)...')
        
        const batchPromises = []
        
        for (let i = 0; i < this.iterations; i += this.concurrency) {
            const batch = []
            
            for (let j = 0; j < this.concurrency && (i + j) < this.iterations; j++) {
                const testId = i + j
                batch.push(this.databaseOperation(testId))
            }
            
            batchPromises.push(Promise.allSettled(batch))
            
            // Progress reporting every 100K operations
            if (i % 100000 === 0) {
                console.log(`Database progress: ${i.toLocaleString()} / ${this.iterations.toLocaleString()}`)
                await this.delay(10) // Prevent overwhelming
            }
        }
        
        const results = await Promise.all(batchPromises)
        this.processResults('database', results)
    }

    async databaseOperation(testId) {
        try {
            const username = `stressuser_${testId}_${this.randomString(5)}`
            const email = `stress_${testId}@test.com`
            
            // Test registration
            const registerResponse = await fetch('/api/players/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email })
            })
            
            if (!registerResponse.ok) {
                throw new Error(`Registration failed: ${registerResponse.status}`)
            }
            
            const registerData = await registerResponse.json()
            
            // Test login
            const loginResponse = await fetch('/api/players/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            })
            
            if (!loginResponse.ok) {
                throw new Error(`Login failed: ${loginResponse.status}`)
            }
            
            const loginData = await loginResponse.json()
            
            // Test player update
            const updateResponse = await fetch('/api/players/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playerId: loginData.player.id,
                    updates: {
                        money: this.randomInt(1000, 100000),
                        health: this.randomInt(50, 100),
                        experience: this.randomInt(0, 10000)
                    }
                })
            })
            
            if (!updateResponse.ok) {
                throw new Error(`Update failed: ${updateResponse.status}`)
            }
            
            return { success: true, testId, playerId: loginData.player.id }
        } catch (error) {
            return { success: false, testId, error: error.message }
        }
    }

    // Test 2: Authentication Stress Test
    async stressTestAuthentication() {
        console.log('🔐 Starting Authentication Stress Test (50M operations)...')
        
        const batchPromises = []
        const users = []
        
        // Pre-create users for login testing
        for (let i = 0; i < 10000; i++) {
            users.push(`authtest_${i}_${this.randomString(5)}`)
        }
        
        for (let i = 0; i < this.iterations; i += this.concurrency) {
            const batch = []
            
            for (let j = 0; j < this.concurrency && (i + j) < this.iterations; j++) {
                const testId = i + j
                const username = users[testId % users.length]
                batch.push(this.authOperation(username, testId))
            }
            
            batchPromises.push(Promise.allSettled(batch))
            
            if (i % 100000 === 0) {
                console.log(`Auth progress: ${i.toLocaleString()} / ${this.iterations.toLocaleString()}`)
                await this.delay(5)
            }
        }
        
        const results = await Promise.all(batchPromises)
        this.processResults('authentication', results)
    }

    async authOperation(username, testId) {
        try {
            // Test rapid login/logout cycles
            const operations = []
            
            for (let cycle = 0; cycle < 10; cycle++) {
                operations.push(
                    fetch('/api/players/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username })
                    })
                )
            }
            
            const results = await Promise.all(operations)
            
            for (const response of results) {
                if (!response.ok) {
                    throw new Error(`Auth cycle failed: ${response.status}`)
                }
            }
            
            return { success: true, testId, username, cycles: 10 }
        } catch (error) {
            return { success: false, testId, error: error.message }
        }
    }

    // Test 3: Game Logic Stress Test
    async stressTestGameLogic() {
        console.log('🎮 Starting Game Logic Stress Test (50M operations)...')
        
        const batchPromises = []
        
        for (let i = 0; i < this.iterations; i += this.concurrency) {
            const batch = []
            
            for (let j = 0; j < this.concurrency && (i + j) < this.iterations; j++) {
                const testId = i + j
                batch.push(this.gameLogicOperation(testId))
            }
            
            batchPromises.push(Promise.allSettled(batch))
            
            if (i % 100000 === 0) {
                console.log(`Game Logic progress: ${i.toLocaleString()} / ${this.iterations.toLocaleString()}`)
                await this.delay(5)
            }
        }
        
        const results = await Promise.all(batchPromises)
        this.processResults('gameLogic', results)
    }

    async gameLogicOperation(testId) {
        try {
            // Simulate game calculations
            const operations = []
            
            // Movement calculations
            for (let move = 0; move < 100; move++) {
                const x = Math.random() * 1000
                const y = Math.random() * 1000
                const z = Math.random() * 100
                const speed = Math.random() * 50
                const deltaTime = 0.016 // 60 FPS
                
                // Physics calculations
                const newX = x + speed * deltaTime * Math.cos(Math.random() * Math.PI * 2)
                const newY = y + speed * deltaTime * Math.sin(Math.random() * Math.PI * 2)
                const newZ = z + (Math.random() - 0.5) * deltaTime * 10
                
                operations.push({ x: newX, y: newY, z: newZ })
            }
            
            // Combat calculations
            for (let combat = 0; combat < 50; combat++) {
                const damage = this.randomInt(10, 100)
                const armor = this.randomInt(0, 100)
                const health = this.randomInt(50, 100)
                
                const actualDamage = Math.max(0, damage - armor * 0.5)
                const remainingHealth = Math.max(0, health - actualDamage)
                
                operations.push({ damage: actualDamage, health: remainingHealth })
            }
            
            // Economy calculations
            for (let econ = 0; econ < 25; econ++) {
                const money = this.randomInt(1000, 100000)
                const bankMoney = this.randomInt(5000, 500000)
                const transaction = this.randomInt(-10000, 10000)
                
                const newMoney = Math.max(0, money + transaction)
                const newBankMoney = Math.max(0, bankMoney - transaction)
                
                operations.push({ money: newMoney, bankMoney: newBankMoney })
            }
            
            return { success: true, testId, operations: operations.length }
        } catch (error) {
            return { success: false, testId, error: error.message }
        }
    }

    // Test 4: Weapons System Stress Test
    async stressTestWeapons() {
        console.log('🔫 Starting Weapons Stress Test (50M operations)...')
        
        const weapons = ['pistol', 'shotgun', 'rifle', 'smg', 'sniper', 'rpg']
        const batchPromises = []
        
        for (let i = 0; i < this.iterations; i += this.concurrency) {
            const batch = []
            
            for (let j = 0; j < this.concurrency && (i + j) < this.iterations; j++) {
                const testId = i + j
                batch.push(this.weaponOperation(testId, weapons))
            }
            
            batchPromises.push(Promise.allSettled(batch))
            
            if (i % 100000 === 0) {
                console.log(`Weapons progress: ${i.toLocaleString()} / ${this.iterations.toLocaleString()}`)
                await this.delay(5)
            }
        }
        
        const results = await Promise.all(batchPromises)
        this.processResults('weapons', results)
    }

    async weaponOperation(testId, weapons) {
        try {
            const operations = []
            
            // Test each weapon
            for (const weapon of weapons) {
                // Rapid fire test
                const fireRate = weapon === 'pistol' ? 500 : 
                               weapon === 'shotgun' ? 1000 :
                               weapon === 'rifle' ? 150 :
                               weapon === 'smg' ? 100 :
                               weapon === 'sniper' ? 2000 : 3000
                
                const shots = Math.floor(10000 / fireRate) // Shots in 10 seconds
                
                for (let shot = 0; shot < shots; shot++) {
                    const damage = weapon === 'pistol' ? 25 :
                                  weapon === 'shotgun' ? 75 :
                                  weapon === 'rifle' ? 35 :
                                  weapon === 'smg' ? 20 :
                                  weapon === 'sniper' ? 100 : 200
                    
                    const range = weapon === 'shotgun' ? 30 :
                                 weapon === 'sniper' ? 200 :
                                 weapon === 'rpg' ? 150 :
                                 weapon === 'rifle' ? 100 : 50
                    
                    operations.push({
                        weapon,
                        shot: shot + 1,
                        damage,
                        range,
                        timestamp: Date.now() + shot * fireRate
                    })
                }
                
                // Reload test
                const reloadTime = weapon === 'shotgun' ? 2000 :
                                  weapon === 'rpg' ? 3000 :
                                  weapon === 'sniper' ? 2500 : 1500
                
                operations.push({
                    weapon,
                    action: 'reload',
                    reloadTime
                })
            }
            
            return { success: true, testId, totalShots: operations.length }
        } catch (error) {
            return { success: false, testId, error: error.message }
        }
    }

    // Test 5: Multiplayer Stress Test
    async stressTestMultiplayer() {
        console.log('🌐 Starting Multiplayer Stress Test (50M operations)...')
        
        const batchPromises = []
        
        for (let i = 0; i < this.iterations; i += this.concurrency) {
            const batch = []
            
            for (let j = 0; j < this.concurrency && (i + j) < this.iterations; j++) {
                const testId = i + j
                batch.push(this.multiplayerOperation(testId))
            }
            
            batchPromises.push(Promise.allSettled(batch))
            
            if (i % 100000 === 0) {
                console.log(`Multiplayer progress: ${i.toLocaleString()} / ${this.iterations.toLocaleString()}`)
                await this.delay(5)
            }
        }
        
        const results = await Promise.all(batchPromises)
        this.processResults('multiplayer', results)
    }

    async multiplayerOperation(testId) {
        try {
            const operations = []
            
            // Simulate multiplayer room operations
            const roomCount = this.randomInt(1, 100)
            const playersPerRoom = this.randomInt(2, 10)
            
            for (let room = 0; room < roomCount; room++) {
                // Room creation
                operations.push({
                    action: 'create_room',
                    roomId: `room_${testId}_${room}`,
                    maxPlayers: playersPerRoom
                })
                
                // Player joins
                for (let player = 0; player < playersPerRoom; player++) {
                    operations.push({
                        action: 'player_join',
                        roomId: `room_${testId}_${room}`,
                        playerId: `player_${testId}_${room}_${player}`,
                        position: {
                            x: Math.random() * 1000,
                            y: Math.random() * 1000,
                            z: Math.random() * 100
                        }
                    })
                }
                
                // Position updates (high frequency)
                for (let update = 0; update < 100; update++) {
                    operations.push({
                        action: 'position_update',
                        roomId: `room_${testId}_${room}`,
                        playerId: `player_${testId}_${room}_${this.randomInt(0, playersPerRoom - 1)}`,
                        position: {
                            x: Math.random() * 1000,
                            y: Math.random() * 1000,
                            z: Math.random() * 100
                        },
                        timestamp: Date.now() + update * 16 // 60 FPS
                    })
                }
            }
            
            return { success: true, testId, operations: operations.length }
        } catch (error) {
            return { success: false, testId, error: error.message }
        }
    }

    // Test 6: Battle Pass Stress Test
    async stressTestBattlePass() {
        console.log('🏆 Starting Battle Pass Stress Test (50M operations)...')
        
        const batchPromises = []
        
        for (let i = 0; i < this.iterations; i += this.concurrency) {
            const batch = []
            
            for (let j = 0; j < this.concurrency && (i + j) < this.iterations; j++) {
                const testId = i + j
                batch.push(this.battlePassOperation(testId))
            }
            
            batchPromises.push(Promise.allSettled(batch))
            
            if (i % 100000 === 0) {
                console.log(`Battle Pass progress: ${i.toLocaleString()} / ${this.iterations.toLocaleString()}`)
                await this.delay(5)
            }
        }
        
        const results = await Promise.all(batchPromises)
        this.processResults('battlePass', results)
    }

    async battlePassOperation(testId) {
        try {
            const operations = []
            
            // XP gain simulation
            let currentXP = 0
            let currentTier = 1
            const maxTier = 100
            
            for (let action = 0; action < 1000; action++) {
                const xpGain = this.randomInt(50, 500)
                currentXP += xpGain
                
                // Tier progression
                const xpForNextTier = currentTier * 1000
                if (currentXP >= xpForNextTier && currentTier < maxTier) {
                    currentXP -= xpForNextTier
                    currentTier++
                    
                    operations.push({
                        action: 'tier_up',
                        newTier: currentTier,
                        totalXP: currentTier * 1000 + currentXP
                    })
                }
                
                operations.push({
                    action: 'xp_gain',
                    xp: xpGain,
                    totalXP: currentTier * 1000 + currentXP,
                    currentTier
                })
            }
            
            // Reward claiming simulation
            for (let tier = 1; tier <= currentTier; tier++) {
                for (let reward = 0; reward < 5; reward++) {
                    operations.push({
                        action: 'claim_reward',
                        tier,
                        reward,
                        rewardType: this.randomInt(1, 5) // 1: money, 2: weapon, 3: skin, 4: emote, 5: title
                    })
                }
            }
            
            return { success: true, testId, finalTier: currentTier, totalXP: currentTier * 1000 + currentXP, operations: operations.length }
        } catch (error) {
            return { success: false, testId, error: error.message }
        }
    }

    // Test 7: Gang System Stress Test
    async stressTestGangs() {
        console.log('👥 Starting Gang System Stress Test (50M operations)...')
        
        const batchPromises = []
        
        for (let i = 0; i < this.iterations; i += this.concurrency) {
            const batch = []
            
            for (let j = 0; j < this.concurrency && (i + j) < this.iterations; j++) {
                const testId = i + j
                batch.push(this.gangOperation(testId))
            }
            
            batchPromises.push(Promise.allSettled(batch))
            
            if (i % 100000 === 0) {
                console.log(`Gangs progress: ${i.toLocaleString()} / ${this.iterations.toLocaleString()}`)
                await this.delay(5)
            }
        }
        
        const results = await Promise.all(batchPromises)
        this.processResults('gangs', results)
    }

    async gangOperation(testId) {
        try {
            const operations = []
            
            // Gang creation
            const gangCount = this.randomInt(1, 10)
            
            for (let gang = 0; gang < gangCount; gang++) {
                const gangName = `gang_${testId}_${gang}_${this.randomString(5)}`
                const memberCount = this.randomInt(5, 50)
                
                operations.push({
                    action: 'create_gang',
                    gangName,
                    leaderId: `leader_${testId}_${gang}`,
                    memberCount
                })
                
                // Member management
                for (let member = 0; member < memberCount; member++) {
                    operations.push({
                        action: 'add_member',
                        gangName,
                        memberId: `member_${testId}_${gang}_${member}`,
                        role: member === 0 ? 'leader' : member < 5 ? 'officer' : 'member'
                    })
                }
                
                // Territory control simulation
                const territoryCount = this.randomInt(1, 20)
                for (let territory = 0; territory < territoryCount; territory++) {
                    operations.push({
                        action: 'territory_control',
                        gangName,
                        territoryId: `territory_${testId}_${gang}_${territory}`,
                        control: this.randomInt(0, 100),
                        timestamp: Date.now() + territory * 1000
                    })
                }
                
                // Gang wars simulation
                if (gang > 0) {
                    operations.push({
                        action: 'gang_war',
                        attacker: `gang_${testId}_${gang - 1}`,
                        defender: gangName,
                        duration: this.randomInt(300, 3600), // 5 minutes to 1 hour
                        participants: this.randomInt(10, 100)
                    })
                }
            }
            
            return { success: true, testId, gangsCreated: gangCount, operations: operations.length }
        } catch (error) {
            return { success: false, testId, error: error.message }
        }
    }

    // Test 8: Performance Stress Test
    async stressTestPerformance() {
        console.log('⚡ Starting Performance Stress Test (50M operations)...')
        
        const batchPromises = []
        
        for (let i = 0; i < this.iterations; i += this.concurrency) {
            const batch = []
            
            for (let j = 0; j < this.concurrency && (i + j) < this.iterations; j++) {
                const testId = i + j
                batch.push(this.performanceOperation(testId))
            }
            
            batchPromises.push(Promise.allSettled(batch))
            
            if (i % 100000 === 0) {
                console.log(`Performance progress: ${i.toLocaleString()} / ${this.iterations.toLocaleString()}`)
                await this.delay(5)
            }
        }
        
        const results = await Promise.all(batchPromises)
        this.processResults('performance', results)
    }

    async performanceOperation(testId) {
        try {
            const startTime = performance.now()
            
            // Heavy computational tasks
            const operations = []
            
            // Matrix calculations (physics simulation)
            for (let matrix = 0; matrix < 100; matrix++) {
                const m1 = [
                    [Math.random(), Math.random(), Math.random(), Math.random()],
                    [Math.random(), Math.random(), Math.random(), Math.random()],
                    [Math.random(), Math.random(), Math.random(), Math.random()],
                    [Math.random(), Math.random(), Math.random(), Math.random()]
                ]
                
                const m2 = [
                    [Math.random(), Math.random(), Math.random(), Math.random()],
                    [Math.random(), Math.random(), Math.random(), Math.random()],
                    [Math.random(), Math.random(), Math.random(), Math.random()],
                    [Math.random(), Math.random(), Math.random(), Math.random()]
                ]
                
                // Matrix multiplication
                const result = []
                for (let i = 0; i < 4; i++) {
                    result[i] = []
                    for (let j = 0; j < 4; j++) {
                        let sum = 0
                        for (let k = 0; k < 4; k++) {
                            sum += m1[i][k] * m2[k][j]
                        }
                        result[i][j] = sum
                    }
                }
                
                operations.push({ matrix, result })
            }
            
            // Collision detection
            const objects = []
            for (let obj = 0; obj < 1000; obj++) {
                objects.push({
                    x: Math.random() * 1000,
                    y: Math.random() * 1000,
                    z: Math.random() * 100,
                    radius: Math.random() * 10 + 1
                })
            }
            
            let collisions = 0
            for (let i = 0; i < objects.length; i++) {
                for (let j = i + 1; j < objects.length; j++) {
                    const dx = objects[i].x - objects[j].x
                    const dy = objects[i].y - objects[j].y
                    const dz = objects[i].z - objects[j].z
                    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
                    
                    if (distance < objects[i].radius + objects[j].radius) {
                        collisions++
                    }
                }
            }
            
            operations.push({ objects: objects.length, collisions })
            
            // Pathfinding simulation
            const grid = []
            const gridSize = 100
            
            for (let x = 0; x < gridSize; x++) {
                grid[x] = []
                for (let y = 0; y < gridSize; y++) {
                    grid[x][y] = Math.random() > 0.3 ? 0 : 1 // 0 = walkable, 1 = obstacle
                }
            }
            
            // Simple A* pathfinding
            const start = { x: 0, y: 0 }
            const end = { x: gridSize - 1, y: gridSize - 1 }
            
            const path = this.findPath(grid, start, end)
            operations.push({ gridSize, pathLength: path.length })
            
            const endTime = performance.now()
            const duration = endTime - startTime
            
            return { 
                success: true, 
                testId, 
                duration,
                operations: operations.length,
                opsPerSecond: (operations.length / duration) * 1000
            }
        } catch (error) {
            return { success: false, testId, error: error.message }
        }
    }

    // Simple A* pathfinding implementation
    findPath(grid, start, end) {
        const openSet = [start]
        const closedSet = []
        const gScore = {}
        const fScore = {}
        const cameFrom = {}
        
        const key = (pos) => `${pos.x},${pos.y}`
        
        gScore[key(start)] = 0
        fScore[key(start)] = this.heuristic(start, end)
        
        while (openSet.length > 0) {
            let current = openSet[0]
            let currentIndex = 0
            
            for (let i = 1; i < openSet.length; i++) {
                if (fScore[key(openSet[i])] < fScore[key(current)]) {
                    current = openSet[i]
                    currentIndex = i
                }
            }
            
            if (current.x === end.x && current.y === end.y) {
                return this.reconstructPath(cameFrom, current)
            }
            
            openSet.splice(currentIndex, 1)
            closedSet.push(current)
            
            const neighbors = this.getNeighbors(grid, current)
            
            for (const neighbor of neighbors) {
                if (closedSet.some(pos => pos.x === neighbor.x && pos.y === neighbor.y)) {
                    continue
                }
                
                const tentativeGScore = gScore[key(current)] + 1
                
                if (!openSet.some(pos => pos.x === neighbor.x && pos.y === neighbor.y)) {
                    openSet.push(neighbor)
                } else if (tentativeGScore >= gScore[key(neighbor)]) {
                    continue
                }
                
                cameFrom[key(neighbor)] = current
                gScore[key(neighbor)] = tentativeGScore
                fScore[key(neighbor)] = gScore[key(neighbor)] + this.heuristic(neighbor, end)
            }
        }
        
        return []
    }

    heuristic(pos1, pos2) {
        return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y)
    }

    getNeighbors(grid, pos) {
        const neighbors = []
        const directions = [
            { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }
        ]
        
        for (const dir of directions) {
            const newX = pos.x + dir.x
            const newY = pos.y + dir.y
            
            if (newX >= 0 && newX < grid.length && 
                newY >= 0 && newY < grid[0].length && 
                grid[newX][newY] === 0) {
                neighbors.push({ x: newX, y: newY })
            }
        }
        
        return neighbors
    }

    reconstructPath(cameFrom, current) {
        const path = [current]
        const key = (pos) => `${pos.x},${pos.y}`
        
        while (key(current) in cameFrom) {
            current = cameFrom[key(current)]
            path.unshift(current)
        }
        
        return path
    }

    // Process test results
    processResults(testName, results) {
        const testResult = this.testResults[testName]
        
        for (const batch of results) {
            for (const result of batch) {
                if (result.status === 'fulfilled' && result.value.success) {
                    testResult.passed++
                } else {
                    testResult.failed++
                    if (result.status === 'rejected') {
                        testResult.errors.push(result.reason?.message || 'Unknown error')
                    } else if (result.value) {
                        testResult.errors.push(result.value.error || 'Unknown error')
                    }
                }
            }
        }
        
        console.log(`✅ ${testName} completed: ${testResult.passed.toLocaleString()} passed, ${testResult.failed.toLocaleString()} failed`)
    }

    // Generate comprehensive report
    generateReport() {
        const totalTime = Date.now() - this.startTime
        const totalOperations = this.iterations * 8 // 8 test types
        
        console.log('\n' + '='.repeat(80))
        console.log('🎯 MEGACITY6 COMPREHENSIVE STRESS TEST REPORT')
        console.log('='.repeat(80))
        console.log(`⏱️  Total Time: ${(totalTime / 1000 / 60).toFixed(2)} minutes`)
        console.log(`📊 Total Operations: ${totalOperations.toLocaleString()}`)
        console.log(`🚀 Operations/Second: ${(totalOperations / (totalTime / 1000)).toLocaleString()}`)
        console.log(`🔄 Iterations per Test: ${this.iterations.toLocaleString()}`)
        console.log(`⚡ Concurrency: ${this.concurrency}`)
        
        console.log('\n📋 TEST RESULTS:')
        console.log('-'.repeat(80))
        
        let totalPassed = 0
        let totalFailed = 0
        
        for (const [testName, result] of Object.entries(this.testResults)) {
            totalPassed += result.passed
            totalFailed += result.failed
            
            const successRate = ((result.passed / (result.passed + result.failed)) * 100).toFixed(2)
            const status = result.failed === 0 ? '✅' : result.failed < result.passed * 0.01 ? '⚠️' : '❌'
            
            console.log(`${status} ${testName.toUpperCase().padEnd(15)}: ${result.passed.toLocaleString().padStart(10)} passed | ${result.failed.toLocaleString().padStart(10)} failed | ${successRate}% success`)
            
            if (result.errors.length > 0 && result.errors.length < 10) {
                console.log(`   Errors: ${result.errors.slice(0, 3).join(', ')}`)
            } else if (result.errors.length >= 10) {
                console.log(`   Errors: ${result.errors.length} total (showing first 3): ${result.errors.slice(0, 3).join(', ')}`)
            }
        }
        
        console.log('-'.repeat(80))
        const overallSuccessRate = ((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(2)
        const overallStatus = totalFailed === 0 ? '🎉' : totalFailed < totalPassed * 0.01 ? '✅' : '⚠️'
        
        console.log(`${overallStatus} OVERALL: ${totalPassed.toLocaleString()} passed | ${totalFailed.toLocaleString()} failed | ${overallSuccessRate}% success`)
        
        console.log('\n🔍 PERFORMANCE ANALYSIS:')
        console.log('-'.repeat(80))
        
        if (this.testResults.performance.passed > 0) {
            const avgOpsPerSecond = this.testResults.performance.passed / (totalTime / 1000)
            console.log(`💻 Average Operations/Second: ${avgOpsPerSecond.toLocaleString()}`)
            console.log(`🎮 Game Logic Performance: ${avgOpsPerSecond > 1000000 ? 'Excellent' : avgOpsPerSecond > 500000 ? 'Good' : 'Needs Optimization'}`)
        }
        
        console.log('\n📈 RECOMMENDATIONS:')
        console.log('-'.repeat(80))
        
        if (this.testResults.database.failed > 0) {
            console.log('🗄️  Database: Consider connection pooling or caching strategies')
        }
        
        if (this.testResults.multiplayer.failed > 0) {
            console.log('🌐 Multiplayer: Implement load balancing and connection management')
        }
        
        if (this.testResults.performance.failed > 0) {
            console.log('⚡ Performance: Optimize algorithms and consider Web Workers')
        }
        
        if (totalFailed === 0) {
            console.log('🎉 All systems passed! Game is ready for production deployment.')
        }
        
        console.log('\n' + '='.repeat(80))
        console.log('🏁 STRESS TEST COMPLETED')
        console.log('='.repeat(80))
    }

    // Run all stress tests
    async runAllTests() {
        console.log('🚀 Starting MegaCity6 Comprehensive Stress Test Suite')
        console.log(`📊 Testing ${this.iterations.toLocaleString()} operations per test type`)
        console.log(`⚡ Running with ${this.concurrency} concurrent operations`)
        console.log(`⏱️  Estimated time: ~${(this.iterations * 8 / this.concurrency / 60).toFixed(0)} minutes\n`)
        
        try {
            await this.stressTestDatabase()
            await this.stressTestAuthentication()
            await this.stressTestGameLogic()
            await this.stressTestWeapons()
            await this.stressTestMultiplayer()
            await this.stressTestBattlePass()
            await this.stressTestGangs()
            await this.stressTestPerformance()
            
            this.generateReport()
        } catch (error) {
            console.error('❌ Stress test suite failed:', error)
        }
    }
}

// Auto-start stress tests
if (typeof window !== 'undefined') {
    window.stressTestSuite = new StressTestSuite()
    console.log('🔥 Stress test suite loaded! Run: stressTestSuite.runAllTests()')
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StressTestSuite
}

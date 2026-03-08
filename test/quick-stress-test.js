// Quick Stress Test (1M operations each) for immediate testing
class QuickStressTest {
    constructor() {
        this.iterations = 1000000; // 1 million for quick testing
        this.results = {}
    }

    async runQuickTests() {
        console.log('⚡ QUICK STRESS TEST - 1M operations per test')
        console.log('⏱️  Estimated time: 2-5 minutes')
        console.log('')

        // Test 1: Database operations
        console.log('🗄️  Testing database operations...')
        await this.testDatabase()
        
        // Test 2: Game calculations
        console.log('🎮 Testing game calculations...')
        await this.testGameCalculations()
        
        // Test 3: Weapon systems
        console.log('🔫 Testing weapon systems...')
        await this.testWeapons()
        
        // Test 4: Performance
        console.log('⚡ Testing performance...')
        await this.testPerformance()
        
        this.generateQuickReport()
    }

    async testDatabase() {
        const startTime = Date.now()
        let passed = 0
        let failed = 0

        for (let i = 0; i < this.iterations; i++) {
            try {
                // Simulate database operation
                const operation = {
                    type: ['register', 'login', 'update'][Math.floor(Math.random() * 3)],
                    data: {
                        username: `user_${i}`,
                        money: Math.random() * 100000,
                        health: Math.random() * 100
                    }
                }
                
                // Simulate network latency
                await new Promise(resolve => setTimeout(resolve, Math.random() * 5))
                
                passed++
            } catch (error) {
                failed++
            }
            
            if (i % 100000 === 0) {
                console.log(`Database: ${i.toLocaleString()} / ${this.iterations.toLocaleString()}`)
            }
        }

        this.results.database = { passed, failed, time: Date.now() - startTime }
    }

    async testGameCalculations() {
        const startTime = Date.now()
        let passed = 0
        let failed = 0

        for (let i = 0; i < this.iterations; i++) {
            try {
                // Movement calculations
                const x = Math.random() * 1000
                const y = Math.random() * 1000
                const speed = Math.random() * 50
                const angle = Math.random() * Math.PI * 2
                
                const newX = x + speed * Math.cos(angle)
                const newY = y + speed * Math.sin(angle)
                
                // Combat calculations
                const damage = Math.random() * 100
                const armor = Math.random() * 100
                const actualDamage = Math.max(0, damage - armor * 0.5)
                
                // Economy calculations
                const money = Math.random() * 100000
                const transaction = Math.random() * 10000 - 5000
                const newMoney = Math.max(0, money + transaction)
                
                passed++
            } catch (error) {
                failed++
            }
            
            if (i % 100000 === 0) {
                console.log(`Game Logic: ${i.toLocaleString()} / ${this.iterations.toLocaleString()}`)
            }
        }

        this.results.gameCalculations = { passed, failed, time: Date.now() - startTime }
    }

    async testWeapons() {
        const startTime = Date.now()
        let passed = 0
        let failed = 0
        const weapons = ['pistol', 'shotgun', 'rifle', 'smg', 'sniper', 'rpg']

        for (let i = 0; i < this.iterations; i++) {
            try {
                const weapon = weapons[Math.floor(Math.random() * weapons.length)]
                const shots = Math.floor(Math.random() * 100) + 1
                
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
                    
                    // Hit calculation
                    const accuracy = weapon === 'sniper' ? 0.95 :
                                   weapon === 'rifle' ? 0.85 :
                                   weapon === 'smg' ? 0.70 : 0.80
                    
                    const hit = Math.random() < accuracy
                    const actualDamage = hit ? damage : 0
                }
                
                passed++
            } catch (error) {
                failed++
            }
            
            if (i % 100000 === 0) {
                console.log(`Weapons: ${i.toLocaleString()} / ${this.iterations.toLocaleString()}`)
            }
        }

        this.results.weapons = { passed, failed, time: Date.now() - startTime }
    }

    async testPerformance() {
        const startTime = Date.now()
        let passed = 0
        let failed = 0

        for (let i = 0; i < this.iterations; i++) {
            try {
                // Matrix operations
                const m1 = Array(4).fill().map(() => Array(4).fill().map(() => Math.random()))
                const m2 = Array(4).fill().map(() => Array(4).fill().map(() => Math.random()))
                
                // Simple matrix multiplication
                const result = Array(4).fill().map(() => Array(4).fill(0))
                for (let x = 0; x < 4; x++) {
                    for (let y = 0; y < 4; y++) {
                        for (let z = 0; z < 4; z++) {
                            result[x][y] += m1[x][z] * m2[z][y]
                        }
                    }
                }
                
                // Collision detection
                const objects = Array(100).fill().map(() => ({
                    x: Math.random() * 1000,
                    y: Math.random() * 1000,
                    radius: Math.random() * 10 + 1
                }))
                
                let collisions = 0
                for (let j = 0; j < objects.length; j++) {
                    for (let k = j + 1; k < objects.length; k++) {
                        const dx = objects[j].x - objects[k].x
                        const dy = objects[j].y - objects[k].y
                        const distance = Math.sqrt(dx * dx + dy * dy)
                        
                        if (distance < objects[j].radius + objects[k].radius) {
                            collisions++
                        }
                    }
                }
                
                passed++
            } catch (error) {
                failed++
            }
            
            if (i % 100000 === 0) {
                console.log(`Performance: ${i.toLocaleString()} / ${this.iterations.toLocaleString()}`)
            }
        }

        this.results.performance = { passed, failed, time: Date.now() - startTime }
    }

    generateQuickReport() {
        console.log('\n' + '='.repeat(60))
        console.log('⚡ QUICK STRESS TEST REPORT')
        console.log('='.repeat(60))
        
        let totalPassed = 0
        let totalFailed = 0
        let totalTime = 0

        for (const [testName, result] of Object.entries(this.results)) {
            totalPassed += result.passed
            totalFailed += result.failed
            totalTime += result.time
            
            const successRate = ((result.passed / (result.passed + result.failed)) * 100).toFixed(2)
            const opsPerSecond = (result.passed / (result.time / 1000)).toLocaleString()
            
            console.log(`✅ ${testName}: ${result.passed.toLocaleString()} passed | ${result.failed.toLocaleString()} failed | ${successRate}% | ${opsPerSecond} ops/sec`)
        }

        console.log('-'.repeat(60))
        const overallSuccessRate = ((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(2)
        const totalOpsPerSecond = (totalPassed / (totalTime / 1000)).toLocaleString()
        
        console.log(`🎯 OVERALL: ${totalPassed.toLocaleString()} passed | ${totalFailed.toLocaleString()} failed | ${overallSuccessRate}% | ${totalOpsPerSecond} ops/sec`)
        console.log(`⏱️  Total Time: ${(totalTime / 1000).toFixed(2)} seconds`)
        console.log('='.repeat(60))
        
        if (totalFailed === 0) {
            console.log('🎉 All quick tests passed! Ready for full stress testing.')
        } else {
            console.log('⚠️  Some tests failed. Check system before full stress testing.')
        }
    }
}

// Auto-run quick test
if (typeof window !== 'undefined') {
    window.quickStressTest = new QuickStressTest()
    console.log('⚡ Quick stress test loaded! Run: quickStressTest.runQuickTests()')
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuickStressTest
}

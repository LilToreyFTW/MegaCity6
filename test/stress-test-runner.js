// Stress Test Runner for MegaCity6
// Run this in browser console or Node.js

(async function runStressTests() {
    console.clear()
    console.log('🔥🔥🔥 MEGACITY6 STRESS TEST INITIATED 🔥🔥🔥')
    console.log('Testing all systems 50,000,000 times each...')
    console.log('This will take approximately 30-60 minutes to complete.')
    console.log('⚠️  WARNING: This will heavily stress your system and database!')
    console.log('')
    
    // Check if we're in browser
    if (typeof window !== 'undefined') {
        // Browser version
        if (!window.stressTestSuite) {
            console.error('❌ Stress test suite not loaded. Please load stress-test.js first.')
            return
        }
        
        console.log('🌐 Running stress tests in browser environment...')
        console.log('📊 Open browser console to monitor progress')
        console.log('')
        
        // Monitor system resources
        let memoryMonitor = setInterval(() => {
            if (performance.memory) {
                const used = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)
                const total = (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2)
                console.log(`💾 Memory: ${used}MB / ${total}MB`)
            }
        }, 10000)
        
        try {
            await window.stressTestSuite.runAllTests()
            clearInterval(memoryMonitor)
            console.log('🎉 All stress tests completed!')
        } catch (error) {
            clearInterval(memoryMonitor)
            console.error('❌ Stress tests failed:', error)
        }
        
    } else {
        // Node.js version
        const StressTestSuite = require('./stress-test.js')
        const suite = new StressTestSuite()
        
        console.log('🖥️  Running stress tests in Node.js environment...')
        console.log('📊 Monitor terminal for progress updates')
        console.log('')
        
        // Monitor process memory
        let memoryMonitor = setInterval(() => {
            const used = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
            const total = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)
            console.log(`💾 Memory: ${used}MB / ${total}MB`)
        }, 10000)
        
        try {
            await suite.runAllTests()
            clearInterval(memoryMonitor)
            console.log('🎉 All stress tests completed!')
        } catch (error) {
            clearInterval(memoryMonitor)
            console.error('❌ Stress tests failed:', error)
        }
    }
})()

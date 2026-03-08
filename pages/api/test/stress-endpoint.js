// API endpoint for stress testing
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    // Health check for stress testing
    return res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      ready: true
    })
  }

  if (req.method === 'POST') {
    const { testType, iterations = 1000 } = req.body
    
    try {
      const startTime = Date.now()
      let results = []
      
      switch (testType) {
        case 'database':
          results = await stressTestDatabase(iterations)
          break
        case 'cpu':
          results = await stressTestCPU(iterations)
          break
        case 'memory':
          results = await stressTestMemory(iterations)
          break
        case 'network':
          results = await stressTestNetwork(iterations)
          break
        default:
          results = await stressTestCPU(iterations)
      }
      
      const endTime = Date.now()
      const duration = endTime - startTime
      
      return res.status(200).json({
        success: true,
        testType,
        iterations,
        duration,
        opsPerSecond: (iterations / duration) * 1000,
        results,
        memory: process.memoryUsage()
      })
      
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }
}

async function stressTestDatabase(iterations) {
  const results = []
  
  for (let i = 0; i < iterations; i++) {
    const start = Date.now()
    
    // Simulate database operation
    await new Promise(resolve => setTimeout(resolve, Math.random() * 10))
    
    const end = Date.now()
    results.push({
      iteration: i,
      duration: end - start,
      success: true
    })
  }
  
  return results
}

async function stressTestCPU(iterations) {
  const results = []
  
  for (let i = 0; i < iterations; i++) {
    const start = Date.now()
    
    // CPU intensive calculations
    let result = 0
    for (let j = 0; j < 1000; j++) {
      result += Math.sqrt(j) * Math.sin(j) * Math.cos(j)
    }
    
    const end = Date.now()
    results.push({
      iteration: i,
      duration: end - start,
      result: result,
      success: true
    })
  }
  
  return results
}

async function stressTestMemory(iterations) {
  const results = []
  const arrays = []
  
  for (let i = 0; i < iterations; i++) {
    const start = Date.now()
    
    // Memory intensive operations
    const largeArray = new Array(1000).fill(0).map(() => Math.random() * 1000000)
    arrays.push(largeArray)
    
    // Process array
    const sum = largeArray.reduce((a, b) => a + b, 0)
    const avg = sum / largeArray.length
    
    // Clean up some arrays to prevent memory overflow
    if (arrays.length > 100) {
      arrays.splice(0, 50)
    }
    
    const end = Date.now()
    results.push({
      iteration: i,
      duration: end - start,
      arraySize: largeArray.length,
      average: avg,
      success: true
    })
  }
  
  return results
}

async function stressTestNetwork(iterations) {
  const results = []
  
  for (let i = 0; i < iterations; i++) {
    const start = Date.now()
    
    // Simulate network operations
    const payload = {
      id: i,
      data: new Array(100).fill(0).map(() => Math.random()),
      timestamp: Date.now()
    }
    
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50))
    
    const end = Date.now()
    results.push({
      iteration: i,
      duration: end - start,
      payloadSize: JSON.stringify(payload).length,
      success: true
    })
  }
  
  return results
}

import { useEffect } from 'react'
import Head from 'next/head'

export default function StressTestPage() {
  useEffect(() => {
    // Load all systems
    const loadSystems = async () => {
      console.log('🧪 Loading systems for stress testing...');
      
      // Load Three.js
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
      script.async = true
      script.onload = () => {
        console.log('✅ Three.js loaded');
        
        // Load all game systems
        const systems = [
          '/completeGame.js',
          '/advancedAnimations.js',
          '/emoteMenu.js',
          '/emoteAssets.js',
          '/soundEffects.js',
          '/cityGenerator.js'
        ];
        
        let loadedCount = 0;
        systems.forEach(system => {
          const s = document.createElement('script');
          s.src = system;
          s.async = true;
          s.onload = () => {
            loadedCount++;
            console.log(`✅ ${system} loaded`);
            
            if (loadedCount === systems.length) {
              // All systems loaded, run stress test
              setTimeout(() => {
                runStressTest();
              }, 1000);
            }
          };
          s.onerror = () => {
            console.error(`❌ Failed to load ${system}`);
            loadedCount++;
          };
          document.head.appendChild(s);
        });
      };
      document.head.appendChild(script);
    };
    
    const runStressTest = () => {
      console.log('🚀 Starting 7000+ operation stress test...');
      
      // Load and run comprehensive stress test
      const testScript = document.createElement('script');
      testScript.src = '/test/comprehensiveStressTest.js';
      testScript.async = true;
      testScript.onload = () => {
        console.log('🧪 Stress test loaded and running...');
      };
      document.head.appendChild(testScript);
    };
    
    loadSystems();
  }, []);

  return (
    <>
      <Head>
        <title>MegaCity6 - Stress Test</title>
        <meta name="description" content="Comprehensive Stress Testing" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        margin: 0, 
        padding: 0, 
        overflow: 'hidden',
        backgroundColor: '#000',
        color: '#fff',
        fontFamily: 'monospace',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: '#00ff00' }}>
            🧪 MEGACITY6 STRESS TEST
          </h1>
          <div style={{ fontSize: '1.5rem', marginBottom: '30px', color: '#ffff00' }}>
            Running 7000+ Operations
          </div>
          <div style={{ 
            width: '300px', 
            height: '20px', 
            border: '2px solid #00ff00', 
            borderRadius: '10px',
            marginBottom: '20px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, #00ff00, #ffff00, #ff0000)',
              animation: 'loading 2s linear infinite'
            }}></div>
          </div>
          <div style={{ fontSize: '1rem', color: '#ccc', marginBottom: '10px' }}>
            Testing all systems for errors and performance issues...
          </div>
          <div style={{ fontSize: '0.9rem', color: '#888' }}>
            Check browser console for detailed results
          </div>
        </div>
        
        <style jsx>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    </>
  )
}

import { useEffect } from 'react'
import Head from 'next/head'

export default function PlayPage() {
  useEffect(() => {
    // Load Three.js
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    script.async = true
    script.onload = () => {
      console.log('✅ Three.js loaded')
      
      // Load complete game
      const gameScript = document.createElement('script')
      gameScript.src = '/completeGame.js'
      gameScript.async = true
      gameScript.onload = () => {
        console.log('✅ Complete game loaded')
        
        // Load advanced animations
        const animScript = document.createElement('script')
        animScript.src = '/advancedAnimations.js'
        animScript.async = true
        animScript.onload = () => {
          console.log('✅ Advanced animations loaded')
          
          // Load emote menu
          const emoteScript = document.createElement('script')
          emoteScript.src = '/emoteMenu.js'
          emoteScript.async = true
          emoteScript.onload = () => {
            console.log('✅ Emote menu loaded')
            
            // Load emote assets
            const assetsScript = document.createElement('script')
            assetsScript.src = '/emoteAssets.js'
            assetsScript.async = true
            assetsScript.onload = () => {
              console.log('✅ Emote assets loaded')
              
              // Hide loading screen
              setTimeout(() => {
                const loadingEl = document.getElementById('loading-screen')
                if (loadingEl) {
                  loadingEl.style.display = 'none'
                }
              }, 2000)
            }
            document.head.appendChild(assetsScript)
          }
          document.head.appendChild(emoteScript)
        }
        document.head.appendChild(animScript)
      }
      document.head.appendChild(gameScript)
    }
    document.head.appendChild(script)
  }, [])

  return (
    <>
      <Head>
        <title>MegaCity6 - Play Now</title>
        <meta name="description" content="Play MegaCity6 - Complete GTA Game" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        margin: 0, 
        padding: 0, 
        overflow: 'hidden',
        backgroundColor: '#87CEEB'
      }}>
        {/* Loading Screen */}
        <div 
          id="loading-screen"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            fontFamily: 'Arial, sans-serif'
          }}
        >
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>🎮 MegaCity6</h1>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '5px solid #fff', 
            borderTop: '5px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '20px', fontSize: '1.2rem' }}>Loading Complete City...</p>
        </div>
        
        {/* Game Canvas */}
        <canvas 
          id="gameCanvas" 
          style={{ 
            width: '100%', 
            height: '100%', 
            display: 'block' 
          }}
        />
        
        {/* Game UI */}
        <div 
          id="game-ui"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1000
          }}
        >
          {/* Health */}
          <div 
            id="health"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: '#00ff00',
              padding: '10px 15px',
              borderRadius: '5px',
              fontFamily: 'Arial, sans-serif',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            ❤️ Health: 100
          </div>
          
          {/* Armor */}
          <div 
            id="armor"
            style={{
              position: 'absolute',
              top: '60px',
              right: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: '#0099ff',
              padding: '10px 15px',
              borderRadius: '5px',
              fontFamily: 'Arial, sans-serif',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            🛡️ Armor: 0
          </div>
          
          {/* Money */}
          <div 
            id="money"
            style={{
              position: 'absolute',
              top: '100px',
              right: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: '#00ff00',
              padding: '10px 15px',
              borderRadius: '5px',
              fontFamily: 'Arial, sans-serif',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            💰 $1000
          </div>
          
          {/* Wanted Level */}
          <div 
            id="wanted"
            style={{
              position: 'absolute',
              top: '140px',
              right: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: '#ffff00',
              padding: '10px 15px',
              borderRadius: '5px',
              fontFamily: 'Arial, sans-serif',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            ⭐ Wanted: 0
          </div>
          
          {/* Controls Help */}
          <div 
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: '#fff',
              padding: '15px',
              borderRadius: '5px',
              fontFamily: 'Arial, sans-serif',
              fontSize: '14px',
              maxWidth: '350px'
            }}
          >
            <h3 style={{ margin: '0 0 10px 0' }}>🎮 Complete Controls</h3>
            <div style={{ margin: '5px 0', color: '#00ff00' }}>WASD/Arrow Keys - Walk</div>
            <div style={{ margin: '5px 0', color: '#ffff00' }}>Shift + WASD - Run</div>
            <div style={{ margin: '5px 0' }}>E - Enter/Exit Vehicle</div>
            <div style={{ margin: '5px 0' }}>Space/Click - Shoot</div>
            <div style={{ margin: '5px 0' }}>Mouse - Look Around</div>
            <div style={{ margin: '10px 0 5px 0', color: '#e94560', fontWeight: 'bold' }}>🎭 Emote Controls:</div>
            <div style={{ margin: '5px 0', color: '#e94560' }}>B - Toggle Emote Menu</div>
            <div style={{ margin: '5px 0', color: '#e94560' }}>Ctrl + 1-9 - Quick Emotes</div>
            <div style={{ margin: '5px 0', color: '#e94560' }}>Ctrl + R - Random Emote</div>
            <div style={{ margin: '10px 0 5px 0', fontSize: '12px', color: '#aaa' }}>
              Walking Speed: 6 km/h<br/>
              Running Speed: 18 km/h<br/>
              500+ Emotes Available<br/>
              Realistic GTA 5 Movement
            </div>
          </div>
          
          {/* Game Title */}
          <div 
            style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '5px',
              fontFamily: 'Arial, sans-serif',
              fontSize: '20px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            🏙️ MegaCity6 - Complete City
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}

import { useEffect } from 'react'
import Head from 'next/head'
import Script from 'next/script'

export default function Home() {
  useEffect(() => {
    // Load game scripts dynamically
    const scripts = [
      '/game.js',
      '/multiplayer.js',
      '/battlepass.js',
      '/gangs.js',
      '/characterAnimations.js',
      '/updater.js'
    ]

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const scriptElement = document.createElement('script')
        scriptElement.src = src
        scriptElement.async = true
        scriptElement.onload = resolve
        scriptElement.onerror = reject
        document.body.appendChild(scriptElement)
      })
    }

    const loadAllScripts = async () => {
      try {
        for (const script of scripts) {
          await loadScript(script)
        }
        
        // Initialize game after all scripts are loaded
        if (typeof GTA6Game !== 'undefined') {
          window.game = new GTA6Game()
          window.game.init()
          
          // Hide loading screen
          const loadingScreen = document.getElementById('loading-screen')
          if (loadingScreen) {
            loadingScreen.style.display = 'none'
          }
        }
      } catch (error) {
        console.error('Error loading game scripts:', error)
        // Hide loading screen even if there's an error
        const loadingScreen = document.getElementById('loading-screen')
        if (loadingScreen) {
          loadingScreen.innerHTML = '<h1>Error loading game</h1><p>Please refresh the page</p>'
        }
      }
    }

    loadAllScripts()

    return () => {
      // Cleanup scripts if needed
      scripts.forEach(script => {
        const scriptElement = document.querySelector(`script[src="${script}"]`)
        if (scriptElement) {
          document.body.removeChild(scriptElement)
        }
      })
    }
  }, [])

  return (
    <>
      <Head>
        <title>MegaCity6 - Multiplayer GTA Game</title>
        <meta name="description" content="Complete Multiplayer GTA Game with Battle Pass" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" strategy="beforeInteractive" />
      
      <div id="game-container">
        <div id="loading-screen">
          <h1>Loading MegaCity6...</h1>
          <div className="loading-spinner"></div>
        </div>
      </div>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: Arial, sans-serif;
          background: #000;
          color: #fff;
          overflow: hidden;
        }
        
        #game-container {
          width: 100vw;
          height: 100vh;
          position: relative;
        }
        
        #loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          z-index: 9999;
        }
        
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-top: 20px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}

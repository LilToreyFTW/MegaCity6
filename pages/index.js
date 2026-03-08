import { useEffect } from 'react'
import Head from 'next/head'

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

    scripts.forEach(script => {
      const scriptElement = document.createElement('script')
      scriptElement.src = script
      scriptElement.async = true
      document.body.appendChild(scriptElement)
    })

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

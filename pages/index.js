import { useEffect } from 'react'
import Head from 'next/head'
import Script from 'next/script'

export default function Home() {
  useEffect(() => {
    // Setup authentication UI
    const setupAuthUI = () => {
      const loginTab = document.getElementById('login-tab')
      const registerTab = document.getElementById('register-tab')
      const loginForm = document.getElementById('login-form')
      const registerForm = document.getElementById('register-form')
      const loginBtn = document.getElementById('login-btn')
      const registerBtn = document.getElementById('register-btn')
      const authError = document.getElementById('auth-error')

      if (loginTab && registerTab) {
        try {
          loginTab.addEventListener('click', () => {
            if (loginForm && registerForm && authError) {
              loginTab.classList.add('active')
              registerTab.classList.remove('active')
              loginForm.style.display = 'flex'
              registerForm.style.display = 'none'
              authError.style.display = 'none'
            }
          })

          registerTab.addEventListener('click', () => {
            if (loginForm && registerForm && authError) {
              registerTab.classList.add('active')
              loginTab.classList.remove('active')
              registerForm.style.display = 'flex'
              loginForm.style.display = 'none'
              authError.style.display = 'none'
            }
          })
        } catch (tabError) {
          console.warn('Tab switching error:', tabError)
        }
      }

      if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
          try {
            const usernameEl = document.getElementById('username')
            if (!usernameEl) {
              console.error('Username input not found')
              return
            }
            
            const username = usernameEl.value.trim()
            if (!username) {
              if (authError) {
                authError.textContent = 'Please enter a username'
                authError.style.display = 'block'
              }
              return
            }

            // Show loading state
            loginBtn.textContent = 'Logging in...'
            loginBtn.disabled = true
            if (authError) authError.style.display = 'none'

            const result = await gameDatabase.loginPlayer(username)
            if (result.success) {
              console.log('Login successful, starting game...')
              startGame()
            }
          } catch (error) {
            if (authError) {
              authError.textContent = error.message
              authError.style.display = 'block'
            }
            if (loginBtn) {
              loginBtn.textContent = 'Enter Game'
              loginBtn.disabled = false
            }
          }
        })
      }

      if (registerBtn) {
        registerBtn.addEventListener('click', async () => {
          try {
            const usernameEl = document.getElementById('reg-username')
            const emailEl = document.getElementById('reg-email')
            
            if (!usernameEl || !emailEl) {
              console.error('Registration inputs not found')
              return
            }
            
            const username = usernameEl.value.trim()
            const email = emailEl ? emailEl.value.trim() : ''
            
            if (!username) {
              if (authError) {
                authError.textContent = 'Please choose a username'
                authError.style.display = 'block'
              }
              return
            }

            // Show loading state
            registerBtn.textContent = 'Creating account...'
            registerBtn.disabled = true
            if (authError) authError.style.display = 'none'

            const result = await gameDatabase.registerPlayer(username, email || null)
            if (result.success) {
              console.log('Registration successful, starting game...')
              startGame()
            }
          } catch (error) {
            if (authError) {
              authError.textContent = error.message
              authError.style.display = 'block'
            }
            if (registerBtn) {
              registerBtn.textContent = 'Create Account'
              registerBtn.disabled = false
            }
          }
        })
      }
    }

    // Start game
    const startGame = async () => {
      try {
        console.log('Starting MegaCity6...')
        
        // Show loading screen while game initializes
        const loadingScreen = document.getElementById('loading-screen')
        const authModal = document.getElementById('auth-modal')
        
        if (authModal) authModal.style.display = 'none'
        if (loadingScreen) {
          loadingScreen.style.display = 'flex'
          loadingScreen.innerHTML = '<h1>Starting Game...</h1><div className="loading-spinner"></div>'
        }
        
        // Wait for Three.js to be available
        let attempts = 0
        while (typeof THREE === 'undefined' && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100))
          attempts++
        }
        
        if (typeof THREE === 'undefined') {
          throw new Error('Three.js failed to load')
        }
        
        // Wait for game scripts to load
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Check if GTA6Game class is available
        if (typeof GTA6Game === 'undefined') {
          throw new Error('Game scripts failed to load')
        }
        
        console.log('Creating game instance...')
        
        // Create game instance (init is called automatically in constructor)
        window.game = new GTA6Game()
        
        // Wait for game to initialize
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Verify game instance was created properly
        if (!window.game) {
          throw new Error('Failed to create game instance')
        }
        
        // Load player data into game
        const currentPlayer = gameDatabase.getCurrentPlayer()
        if (currentPlayer) {
          console.log('Loading player data:', currentPlayer)
          
          // Update game with player data (with safety checks)
          if (window.game.money !== undefined) {
            window.game.money = currentPlayer.money || 1000
          }
          if (window.game.bankMoney !== undefined) {
            window.game.bankMoney = currentPlayer.bank_money || 5000
          }
          if (window.game.characterHealth !== undefined) {
            window.game.characterHealth = currentPlayer.health || 100
          }
          if (window.game.characterArmor !== undefined) {
            window.game.characterArmor = currentPlayer.armor || 0
          }
          if (window.game.wantedLevel !== undefined) {
            window.game.wantedLevel = currentPlayer.wanted_level || 0
          }
          if (window.game.currentWeapon !== undefined) {
            window.game.currentWeapon = currentPlayer.current_weapon || 'pistol'
          }
          if (window.game.experience !== undefined) {
            window.game.experience = currentPlayer.experience || 0
          }
          
          // Load player position if available (with safety check)
          if (currentPlayer.position_x !== undefined && window.game.vehicle && window.game.vehicle.position) {
            try {
              window.game.vehicle.position.set(
                currentPlayer.position_x,
                currentPlayer.position_y,
                currentPlayer.position_z
              )
            } catch (posError) {
              console.warn('Failed to set player position:', posError)
            }
          }
          
          // Load weapons (with safety checks)
          if (currentPlayer.weapons && window.game.weapons) {
            Object.keys(currentPlayer.weapons).forEach(weaponType => {
              const weaponData = currentPlayer.weapons[weaponType]
              if (window.game.weapons[weaponType]) {
                window.game.weapons[weaponType].ammo = weaponData.ammo
                window.game.weapons[weaponType].unlocked = weaponData.unlocked
              }
            })
          }
        }
        
        // Start database auto-save if available
        if (gameDatabase && gameDatabase.isPlayerOnline && gameDatabase.isPlayerOnline()) {
          gameDatabase.startAutoSave()
        }
        
        // Hide loading screen
        if (loadingScreen) {
          loadingScreen.style.display = 'none'
        }
        
        console.log('Game started successfully')
        
        // Update UI with player stats (with safety checks)
        if (currentPlayer) {
          try {
            const healthEl = document.getElementById('health')
            const armorEl = document.getElementById('armor')
            const moneyEl = document.getElementById('money')
            const wantedEl = document.getElementById('wanted')
            
            if (healthEl) healthEl.textContent = currentPlayer.health || 100
            if (armorEl) armorEl.textContent = currentPlayer.armor || 0
            if (moneyEl) moneyEl.textContent = currentPlayer.money || 1000
            if (wantedEl) wantedEl.textContent = currentPlayer.wanted_level || 0
          } catch (uiError) {
            console.warn('Failed to update UI elements:', uiError)
          }
        }
        
      } catch (error) {
        console.error('Error starting game:', error)
        const loadingScreen = document.getElementById('loading-screen')
        if (loadingScreen) {
          loadingScreen.innerHTML = `
            <h1>Error starting game</h1>
            <p>${error.message}</p>
            <div style="margin-top: 20px;">
              <button onclick="location.reload()" style="padding: 10px 20px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Refresh Page</button>
              <button onclick="window.startGame()" style="padding: 10px 20px; margin: 5px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">Try Again</button>
            </div>
          `
          loadingScreen.style.display = 'flex'
        }
      }
    }

    // Make startGame globally available
    window.startGame = startGame
    
    // Initialize game when Three.js is loaded
    const initializeGame = async () => {
      try {
        // Wait for all dependencies to load
        let attempts = 0
        while (attempts < 100) {
          if (typeof THREE !== 'undefined' && 
              typeof GTA6Game !== 'undefined' && 
              typeof gameDatabase !== 'undefined') {
            break
          }
          await new Promise(resolve => setTimeout(resolve, 100))
          attempts++
        }
        
        if (typeof THREE === 'undefined') {
          console.error('Three.js failed to load')
          return
        }
        
        if (typeof GTA6Game === 'undefined') {
          console.error('Game scripts failed to load')
          return
        }
        
        if (typeof gameDatabase === 'undefined') {
          console.error('Database manager failed to load')
          return
        }
        
        console.log('All dependencies loaded, setting up authentication...')
        
        // Setup authentication UI
        setupAuthUI()
        
        // Check if user is already logged in (from localStorage)
        const savedUsername = localStorage.getItem('megaCity6_username')
        if (savedUsername) {
          console.log('Found saved user:', savedUsername)
          // Auto-login if username is saved
          try {
            const result = await gameDatabase.loginPlayer(savedUsername)
            if (result.success) {
              startGame()
              return
            }
          } catch (error) {
            console.warn('Auto-login failed:', error)
          }
        }
        
        // Show authentication modal if not auto-logged in
        const authModal = document.getElementById('auth-modal')
        const loadingScreen = document.getElementById('loading-screen')
        
        if (loadingScreen) {
          loadingScreen.style.display = 'none'
        }
        
        if (authModal) {
          authModal.style.display = 'flex'
        }
        
      } catch (error) {
        console.error('Game initialization error:', error)
        const loadingScreen = document.getElementById('loading-screen')
        if (loadingScreen) {
          loadingScreen.innerHTML = `
            <h1>Initialization Error</h1>
            <p>${error.message}</p>
            <button onclick="location.reload()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Reload Page</button>
          `
          loadingScreen.style.display = 'flex'
        }
      }
    }

    // Start initialization after component mounts
    setTimeout(() => {
      initializeGame()
    }, 100)
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
      <Script src="/database.js" strategy="afterInteractive" />
      <Script src="/game.js" strategy="afterInteractive" />
      <Script src="/multiplayer.js" strategy="afterInteractive" />
      <Script src="/battlepass.js" strategy="afterInteractive" />
      <Script src="/gangs.js" strategy="afterInteractive" />
      <Script src="/characterAnimations.js" strategy="afterInteractive" />
      <Script src="/updater.js" strategy="afterInteractive" />
      <Script src="/test/quick-stress-test.js" strategy="afterInteractive" />
      <Script src="/test/stress-test.js" strategy="afterInteractive" />
      <Script src="/test/auto-fix-stress-test.js" strategy="afterInteractive" />
      
      <div id="game-container">
        <canvas id="gameCanvas" style={{ display: 'block', width: '100%', height: '100%' }}></canvas>
        
        <div id="loading-screen">
          <h1>Loading MegaCity6...</h1>
          <div className="loading-spinner"></div>
        </div>
        
        <div id="auth-modal" style={{ display: 'none' }}>
          <div className="auth-container">
            <h2>Welcome to MegaCity6</h2>
            <div className="auth-tabs">
              <button id="login-tab" className="active">Login</button>
              <button id="register-tab">Register</button>
            </div>
            
            <div id="login-form" className="auth-form">
              <input type="text" id="username" placeholder="Enter username" />
              <button id="login-btn">Enter Game</button>
            </div>
            
            <div id="register-form" className="auth-form" style={{ display: 'none' }}>
              <input type="text" id="reg-username" placeholder="Choose username" />
              <input type="email" id="reg-email" placeholder="Email (optional)" />
              <button id="register-btn">Create Account</button>
            </div>
            
            <div id="auth-error" className="auth-error"></div>
          </div>
        </div>
        
        {/* Game UI Elements */}
        <div id="game-ui" style={{ position: 'absolute', top: '10px', left: '10px', color: 'white', fontFamily: 'Arial, sans-serif' }}>
          <div id="mission" style={{ fontSize: '16px', marginBottom: '10px' }}>Welcome to MegaCity6</div>
          <div id="stats" style={{ fontSize: '14px' }}>
            <div>Health: <span id="health">100</span></div>
            <div>Armor: <span id="armor">0</span></div>
            <div>Money: $<span id="money">1000</span></div>
            <div>Wanted Level: <span id="wanted">0</span></div>
          </div>
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
        
        #loading-screen, #auth-modal {
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
        
        .auth-container {
          background: rgba(0, 0, 0, 0.8);
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          max-width: 400px;
          width: 90%;
        }
        
        .auth-container h2 {
          text-align: center;
          margin-bottom: 30px;
          color: #3498db;
          font-size: 28px;
        }
        
        .auth-tabs {
          display: flex;
          margin-bottom: 30px;
        }
        
        .auth-tabs button {
          flex: 1;
          padding: 12px;
          background: transparent;
          color: #fff;
          border: 1px solid #3498db;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .auth-tabs button:first-child {
          border-radius: 5px 0 0 5px;
        }
        
        .auth-tabs button:last-child {
          border-radius: 0 5px 5px 0;
        }
        
        .auth-tabs button.active {
          background: #3498db;
          color: #fff;
        }
        
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .auth-form input {
          padding: 15px;
          border: 1px solid #3498db;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 16px;
        }
        
        .auth-form input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        
        .auth-form button {
          padding: 15px;
          background: linear-gradient(45deg, #3498db, #2980b9);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .auth-form button:hover {
          background: linear-gradient(45deg, #2980b9, #3498db);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
        }
        
        .auth-error {
          color: #e74c3c;
          text-align: center;
          margin-top: 15px;
          padding: 10px;
          border-radius: 5px;
          background: rgba(231, 76, 60, 0.1);
          display: none;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}

// MEGACITY6 - EMOTE MENU SYSTEM
// Complete emote menu with 500+ animations, search, favorites, and categories

class EmoteMenu {
    constructor(animationSystem) {
        this.animationSystem = animationSystem;
        this.isOpen = false;
        this.currentCategory = 'favorites';
        this.searchQuery = '';
        this.selectedEmote = null;
        this.menuElement = null;
        this.emoteGrid = null;
        this.searchInput = null;
        this.categoryTabs = null;
        
        console.log('🎭 Initializing Emote Menu...');
        
        this.createMenu();
        this.setupEventListeners();
    }
    
    // Create the emote menu
    createMenu() {
        // Create main menu container
        this.menuElement = document.createElement('div');
        this.menuElement.id = 'emote-menu';
        this.menuElement.className = 'emote-menu';
        this.menuElement.innerHTML = `
            <div class="emote-menu-header">
                <h2 class="emote-menu-title">🎭 Emotes & Animations</h2>
                <button class="emote-menu-close" id="emote-menu-close">✕</button>
            </div>
            
            <div class="emote-menu-search">
                <input type="text" class="emote-search-input" id="emote-search-input" placeholder="🔍 Search emotes...">
            </div>
            
            <div class="emote-menu-categories">
                <div class="category-tabs" id="category-tabs"></div>
            </div>
            
            <div class="emote-menu-content">
                <div class="emote-grid" id="emote-grid"></div>
            </div>
            
            <div class="emote-menu-footer">
                <div class="emote-info" id="emote-info">
                    <span class="emote-count">Loading...</span>
                </div>
                <div class="emote-actions">
                    <button class="emote-btn primary" id="play-emote-btn">Play Emote</button>
                    <button class="emote-btn secondary" id="favorite-emote-btn">⭐ Favorite</button>
                </div>
            </div>
        `;
        
        // Add styles
        this.addStyles();
        
        // Add to body
        document.body.appendChild(this.menuElement);
        
        // Initialize components
        this.initializeComponents();
        
        // Load initial data
        this.loadCategories();
        this.loadEmotes();
    }
    
    // Add CSS styles
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .emote-menu {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 2px solid #0f3460;
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
                z-index: 10000;
                display: none;
                overflow: hidden;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            .emote-menu.open {
                display: block;
                animation: menuSlideIn 0.3s ease-out;
            }
            
            @keyframes menuSlideIn {
                from {
                    opacity: 0;
                    transform: translate(-50%, -45%) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            
            .emote-menu-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
                border-bottom: 2px solid #e94560;
            }
            
            .emote-menu-title {
                color: #fff;
                font-size: 24px;
                font-weight: bold;
                margin: 0;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            }
            
            .emote-menu-close {
                background: #e94560;
                color: white;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                font-size: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .emote-menu-close:hover {
                background: #ff6b6b;
                transform: scale(1.1);
            }
            
            .emote-menu-search {
                padding: 15px 20px;
                background: rgba(0, 0, 0, 0.3);
                border-bottom: 1px solid #333;
            }
            
            .emote-search-input {
                width: 100%;
                padding: 12px 15px;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid #333;
                border-radius: 8px;
                color: white;
                font-size: 16px;
                transition: all 0.3s ease;
            }
            
            .emote-search-input:focus {
                outline: none;
                border-color: #e94560;
                background: rgba(255, 255, 255, 0.15);
                box-shadow: 0 0 10px rgba(233, 69, 96, 0.3);
            }
            
            .emote-search-input::placeholder {
                color: #aaa;
            }
            
            .emote-menu-categories {
                background: rgba(0, 0, 0, 0.2);
                border-bottom: 1px solid #333;
                overflow-x: auto;
            }
            
            .category-tabs {
                display: flex;
                padding: 10px 20px;
                gap: 10px;
                min-width: max-content;
            }
            
            .category-tab {
                padding: 8px 16px;
                background: rgba(255, 255, 255, 0.1);
                border: 2px solid transparent;
                border-radius: 20px;
                color: #ccc;
                cursor: pointer;
                transition: all 0.3s ease;
                white-space: nowrap;
                font-size: 14px;
                font-weight: 500;
            }
            
            .category-tab:hover {
                background: rgba(255, 255, 255, 0.2);
                color: white;
                transform: translateY(-2px);
            }
            
            .category-tab.active {
                background: #e94560;
                color: white;
                border-color: #ff6b6b;
                box-shadow: 0 4px 15px rgba(233, 69, 96, 0.4);
            }
            
            .emote-menu-content {
                padding: 20px;
                max-height: 400px;
                overflow-y: auto;
                background: rgba(0, 0, 0, 0.1);
            }
            
            .emote-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                gap: 15px;
                min-height: 200px;
            }
            
            .emote-item {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
                border: 2px solid #333;
                border-radius: 10px;
                padding: 15px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .emote-item:hover {
                transform: translateY(-5px) scale(1.05);
                border-color: #e94560;
                box-shadow: 0 10px 25px rgba(233, 69, 96, 0.3);
                background: linear-gradient(135deg, rgba(233, 69, 96, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
            }
            
            .emote-item.selected {
                border-color: #e94560;
                background: linear-gradient(135deg, rgba(233, 69, 96, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%);
                box-shadow: 0 0 20px rgba(233, 69, 96, 0.5);
            }
            
            .emote-icon {
                font-size: 32px;
                margin-bottom: 8px;
                display: block;
            }
            
            .emote-name {
                color: white;
                font-size: 12px;
                font-weight: 600;
                margin-bottom: 4px;
                text-transform: capitalize;
                word-break: break-word;
            }
            
            .emote-description {
                color: #aaa;
                font-size: 10px;
                line-height: 1.3;
                height: 26px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .emote-rarity {
                position: absolute;
                top: 5px;
                right: 5px;
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 9px;
                font-weight: bold;
                text-transform: uppercase;
            }
            
            .rarity-common {
                background: #888;
                color: white;
            }
            
            .rarity-uncommon {
                background: #4CAF50;
                color: white;
            }
            
            .rarity-rare {
                background: #2196F3;
                color: white;
            }
            
            .rarity-epic {
                background: #9C27B0;
                color: white;
            }
            
            .rarity-legendary {
                background: linear-gradient(135deg, #FFD700, #FFA500);
                color: #333;
                animation: legendaryPulse 2s infinite;
            }
            
            @keyframes legendaryPulse {
                0%, 100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }
                50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
            }
            
            .emote-menu-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
                border-top: 2px solid #e94560;
            }
            
            .emote-info {
                color: #ccc;
                font-size: 14px;
            }
            
            .emote-actions {
                display: flex;
                gap: 10px;
            }
            
            .emote-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                text-transform: uppercase;
            }
            
            .emote-btn.primary {
                background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
                color: white;
            }
            
            .emote-btn.primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(233, 69, 96, 0.4);
            }
            
            .emote-btn.secondary {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 2px solid #333;
            }
            
            .emote-btn.secondary:hover {
                background: rgba(255, 255, 255, 0.2);
                border-color: #e94560;
                transform: translateY(-2px);
            }
            
            .emote-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }
            
            .emote-loading {
                text-align: center;
                padding: 40px;
                color: #ccc;
                font-size: 18px;
            }
            
            .emote-empty {
                text-align: center;
                padding: 40px;
                color: #888;
                font-size: 16px;
            }
            
            .emote-no-results {
                text-align: center;
                padding: 40px;
                color: #888;
                font-size: 16px;
            }
            
            /* Scrollbar styling */
            .emote-menu-content::-webkit-scrollbar {
                width: 8px;
            }
            
            .emote-menu-content::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 4px;
            }
            
            .emote-menu-content::-webkit-scrollbar-thumb {
                background: #e94560;
                border-radius: 4px;
            }
            
            .emote-menu-content::-webkit-scrollbar-thumb:hover {
                background: #ff6b6b;
            }
            
            .category-tabs::-webkit-scrollbar {
                height: 6px;
            }
            
            .category-tabs::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 3px;
            }
            
            .category-tabs::-webkit-scrollbar-thumb {
                background: #e94560;
                border-radius: 3px;
            }
            
            /* Responsive design */
            @media (max-width: 768px) {
                .emote-menu {
                    width: 95%;
                    max-height: 95vh;
                }
                
                .emote-grid {
                    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                    gap: 10px;
                }
                
                .emote-icon {
                    font-size: 24px;
                }
                
                .emote-name {
                    font-size: 11px;
                }
                
                .emote-description {
                    font-size: 9px;
                }
                
                .category-tabs {
                    flex-wrap: wrap;
                }
                
                .emote-menu-footer {
                    flex-direction: column;
                    gap: 15px;
                }
                
                .emote-actions {
                    width: 100%;
                    justify-content: center;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Initialize components
    initializeComponents() {
        this.searchInput = document.getElementById('emote-search-input');
        this.emoteGrid = document.getElementById('emote-grid');
        this.categoryTabs = document.getElementById('category-tabs');
        
        // Store references
        this.closeBtn = document.getElementById('emote-menu-close');
        this.playBtn = document.getElementById('play-emote-btn');
        this.favoriteBtn = document.getElementById('favorite-emote-btn');
        this.emoteInfo = document.getElementById('emote-info');
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Close button
        this.closeBtn.addEventListener('click', () => this.close());
        
        // Search input
        this.searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.loadEmotes();
        });
        
        // Play button
        this.playBtn.addEventListener('click', () => {
            if (this.selectedEmote) {
                this.playEmote(this.selectedEmote);
            }
        });
        
        // Favorite button
        this.favoriteBtn.addEventListener('click', () => {
            if (this.selectedEmote) {
                this.toggleFavorite(this.selectedEmote);
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
            if (e.key === 'B' && e.ctrlKey) {
                e.preventDefault();
                this.toggle();
            }
        });
        
        // Click outside to close
        this.menuElement.addEventListener('click', (e) => {
            if (e.target === this.menuElement) {
                this.close();
            }
        });
    }
    
    // Load categories
    loadCategories() {
        const categories = this.animationSystem.emoteCategories;
        
        this.categoryTabs.innerHTML = '';
        
        Object.keys(categories).forEach(categoryKey => {
            const category = categories[categoryKey];
            const tab = document.createElement('button');
            tab.className = 'category-tab';
            tab.textContent = `${category.icon} ${category.name}`;
            tab.dataset.category = categoryKey;
            
            if (categoryKey === this.currentCategory) {
                tab.classList.add('active');
            }
            
            tab.addEventListener('click', () => {
                this.selectCategory(categoryKey);
            });
            
            this.categoryTabs.appendChild(tab);
        });
    }
    
    // Load emotes
    loadEmotes() {
        const categories = this.animationSystem.emoteCategories;
        let emotes = [];
        
        if (this.searchQuery) {
            // Search emotes
            emotes = this.animationSystem.searchEmotes(this.searchQuery);
        } else {
            // Get emotes from current category
            const category = categories[this.currentCategory];
            emotes = category ? category.emotes : [];
        }
        
        this.renderEmotes(emotes);
        this.updateEmoteInfo(emotes.length);
    }
    
    // Render emotes
    renderEmotes(emotes) {
        if (emotes.length === 0) {
            this.emoteGrid.innerHTML = `
                <div class="emote-no-results">
                    <div style="font-size: 48px; margin-bottom: 20px;">🔍</div>
                    <div>No emotes found</div>
                    <div style="font-size: 14px; margin-top: 10px; color: #666;">
                        Try a different search term or category
                    </div>
                </div>
            `;
            return;
        }
        
        this.emoteGrid.innerHTML = '';
        
        emotes.forEach(emote => {
            const emoteElement = document.createElement('div');
            emoteElement.className = 'emote-item';
            emoteElement.dataset.emoteName = emote.name;
            
            // Check if this is a favorite
            const isFavorite = this.animationSystem.favoriteEmotes.includes(emote.name);
            
            emoteElement.innerHTML = `
                <div class="emote-icon">${emote.prefix}</div>
                <div class="emote-name">${emote.name.replace(/_/g, ' ')}</div>
                <div class="emote-description">${emote.description}</div>
                <div class="emote-rarity rarity-${emote.rarity}">${emote.rarity}</div>
                ${isFavorite ? '<div class="emote-favorite">⭐</div>' : ''}
            `;
            
            // Add favorite star styling
            if (isFavorite) {
                const style = document.createElement('style');
                style.textContent = `
                    .emote-favorite {
                        position: absolute;
                        top: 5px;
                        left: 5px;
                        font-size: 16px;
                        animation: favoritePulse 1s infinite;
                    }
                    @keyframes favoritePulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.2); }
                    }
                `;
                if (!document.querySelector('style[data-favorite-star]')) {
                    style.setAttribute('data-favorite-star', 'true');
                    document.head.appendChild(style);
                }
            }
            
            emoteElement.addEventListener('click', () => {
                this.selectEmote(emote);
            });
            
            // Double click to play
            emoteElement.addEventListener('dblclick', () => {
                this.playEmote(emote);
            });
            
            this.emoteGrid.appendChild(emoteElement);
        });
    }
    
    // Update emote info
    updateEmoteInfo(count) {
        const total = this.animationSystem.animations.size;
        const favorites = this.animationSystem.favoriteEmotes.length;
        
        this.emoteInfo.innerHTML = `
            <span class="emote-count">
                ${this.searchQuery ? `${count} found` : `${count} emotes`}
                ${!this.searchQuery ? `• ${total} total` : ''}
                ${favorites > 0 ? `• ${favorites} favorites` : ''}
            </span>
        `;
    }
    
    // Select category
    selectCategory(categoryKey) {
        this.currentCategory = categoryKey;
        this.searchQuery = '';
        this.searchInput.value = '';
        
        // Update active tab
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.category === categoryKey) {
                tab.classList.add('active');
            }
        });
        
        this.loadEmotes();
    }
    
    // Select emote
    selectEmote(emote) {
        // Remove previous selection
        document.querySelectorAll('.emote-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Add selection to current emote
        const emoteElement = document.querySelector(`[data-emote-name="${emote.name}"]`);
        if (emoteElement) {
            emoteElement.classList.add('selected');
        }
        
        this.selectedEmote = emote;
        this.updateActionButtons();
    }
    
    // Update action buttons
    updateActionButtons() {
        if (this.selectedEmote) {
            this.playBtn.disabled = false;
            this.favoriteBtn.disabled = false;
            
            const isFavorite = this.animationSystem.favoriteEmotes.includes(this.selectedEmote.name);
            this.favoriteBtn.textContent = isFavorite ? '⭐ Unfavorite' : '⭐ Favorite';
        } else {
            this.playBtn.disabled = true;
            this.favoriteBtn.disabled = true;
        }
    }
    
    // Play emote
    playEmote(emote) {
        if (this.animationSystem && this.animationSystem.playEmote) {
            const character = this.getCurrentCharacter();
            const success = this.animationSystem.playEmote(emote.name, character);
            
            if (success) {
                // Show feedback
                this.showPlayFeedback(emote);
            }
        }
    }
    
    // Get current character
    getCurrentCharacter() {
        // This would get the current character from the game
        // For now, return a placeholder
        return window.game?.character || null;
    }
    
    // Show play feedback
    showPlayFeedback(emote) {
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            z-index: 10001;
            animation: feedbackFade 2s ease-out forwards;
        `;
        feedback.innerHTML = `
            <div style="font-size: 32px; margin-bottom: 10px;">${emote.prefix}</div>
            <div>Playing: ${emote.name.replace(/_/g, ' ')}</div>
        `;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes feedbackFade {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(feedback);
        
        // Remove after animation
        setTimeout(() => {
            document.body.removeChild(feedback);
            document.head.removeChild(style);
        }, 2000);
    }
    
    // Toggle favorite
    toggleFavorite(emote) {
        if (this.animationSystem.favoriteEmotes.includes(emote.name)) {
            this.animationSystem.removeFromFavorites(emote.name);
        } else {
            this.animationSystem.addToFavorites(emote.name);
        }
        
        // Refresh the display
        this.loadEmotes();
        this.updateActionButtons();
        
        // Show feedback
        this.showFavoriteFeedback(emote);
    }
    
    // Show favorite feedback
    showFavoriteFeedback(emote) {
        const isFavorite = this.animationSystem.favoriteEmotes.includes(emote.name);
        const action = isFavorite ? 'Added to' : 'Removed from';
        
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10001;
            animation: slideInRight 0.3s ease-out;
        `;
        feedback.innerHTML = `⭐ ${action} favorites`;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(feedback);
        
        // Remove after delay
        setTimeout(() => {
            feedback.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                document.body.removeChild(feedback);
                document.head.removeChild(style);
            }, 300);
        }, 2000);
    }
    
    // Open menu
    open() {
        this.isOpen = true;
        this.menuElement.classList.add('open');
        
        // Load initial data
        this.loadEmotes();
        
        // Focus search input
        setTimeout(() => {
            this.searchInput.focus();
        }, 100);
        
        console.log('🎭 Emote menu opened');
    }
    
    // Close menu
    close() {
        this.isOpen = false;
        this.menuElement.classList.remove('open');
        this.selectedEmote = null;
        
        console.log('🎭 Emote menu closed');
    }
    
    // Toggle menu
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
    
    // Get menu statistics
    getStats() {
        return {
            isOpen: this.isOpen,
            currentCategory: this.currentCategory,
            searchQuery: this.searchQuery,
            selectedEmote: this.selectedEmote,
            totalEmotes: this.animationSystem.animations.size,
            favoriteEmotes: this.animationSystem.favoriteEmotes.length,
            recentEmotes: this.animationSystem.emoteHistory.length
        };
    }
    
    // Destroy menu
    destroy() {
        if (this.menuElement && this.menuElement.parentNode) {
            this.menuElement.parentNode.removeChild(this.menuElement);
        }
        
        // Remove styles
        const styles = document.querySelectorAll('style[data-emote-menu], style[data-favorite-star]');
        styles.forEach(style => style.remove());
        
        console.log('🎭 Emote menu destroyed');
    }
}

// Export for use in game
if (typeof window !== 'undefined') {
    window.EmoteMenu = EmoteMenu;
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmoteMenu;
}

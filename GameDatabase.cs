using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SQLite;
using System.IO;

namespace MegaCity6
{
    public class GameDatabase
    {
        private SQLiteConnection connection;
        private string databasePath;
        
        public GameDatabase()
        {
            databasePath = "megacity6.db";
            InitializeDatabase();
        }
        
        private void InitializeDatabase()
        {
            // Create database file if it doesn't exist
            if (!File.Exists(databasePath))
            {
                SQLiteConnection.CreateFile(databasePath);
            }
            
            // Open connection
            connection = new SQLiteConnection($"Data Source={databasePath};Version=3;");
            connection.Open();
            
            // Create tables
            CreateTables();
            
            Console.WriteLine("🗄️ MegaCity6 Database initialized");
        }
        
        private void CreateTables()
        {
            // Users table
            string createUsersTable = @"
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE,
                    password_hash TEXT NOT NULL,
                    salt TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    last_login DATETIME,
                    is_banned BOOLEAN DEFAULT 0,
                    ban_reason TEXT,
                    ban_expires DATETIME,
                    vip_status BOOLEAN DEFAULT 0,
                    vip_expires DATETIME,
                    total_playtime INTEGER DEFAULT 0,
                    level INTEGER DEFAULT 1,
                    experience INTEGER DEFAULT 0,
                    money INTEGER DEFAULT 1000,
                    bank_money INTEGER DEFAULT 5000,
                    kills INTEGER DEFAULT 0,
                    deaths INTEGER DEFAULT 0,
                    highest_wanted_level INTEGER DEFAULT 0,
                    missions_completed INTEGER DEFAULT 0,
                    cars_stolen INTEGER DEFAULT 0,
                    total_distance_driven REAL DEFAULT 0
                )";
            
            // Battle Pass table
            string createBattlePassTable = @"
                CREATE TABLE IF NOT EXISTS battle_pass (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    current_tier INTEGER DEFAULT 1,
                    experience INTEGER DEFAULT 0,
                    experience_to_next_tier INTEGER DEFAULT 1000,
                    unlocked_rewards TEXT, -- JSON array of unlocked reward IDs
                    premium_pass BOOLEAN DEFAULT 0,
                    premium_expires DATETIME,
                    season_number INTEGER DEFAULT 1,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )";
            
            // Battle Pass Rewards table
            string createRewardsTable = @"
                CREATE TABLE IF NOT EXISTS battle_pass_rewards (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    tier INTEGER NOT NULL,
                    reward_name TEXT NOT NULL,
                    reward_type TEXT NOT NULL, -- weapon, cosmetic, vehicle, money, special
                    reward_data TEXT, -- JSON with specific reward data
                    rarity TEXT NOT NULL, -- common, rare, epic, legendary, mythic
                    is_premium BOOLEAN DEFAULT 0,
                    season_number INTEGER DEFAULT 1
                )";
            
            // User Weapons table
            string createWeaponsTable = @"
                CREATE TABLE IF NOT EXISTS user_weapons (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    weapon_name TEXT NOT NULL,
                    weapon_type TEXT NOT NULL,
                    damage INTEGER NOT NULL,
                    range INTEGER NOT NULL,
                    fire_rate INTEGER NOT NULL,
                    ammo INTEGER DEFAULT 0,
                    max_ammo INTEGER DEFAULT 0,
                    is_unlocked BOOLEAN DEFAULT 0,
                    unlock_date DATETIME,
                    skin TEXT, -- JSON with weapon skin data
                    attachments TEXT, -- JSON with attachment data
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )";
            
            // User Cosmetics table
            string createCosmeticsTable = @"
                CREATE TABLE IF NOT EXISTS user_cosmetics (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    cosmetic_name TEXT NOT NULL,
                    cosmetic_type TEXT NOT NULL, -- head, neck, wrist, body, back
                    cosmetic_slot TEXT NOT NULL,
                    rarity TEXT NOT NULL,
                    is_equipped BOOLEAN DEFAULT 0,
                    is_unlocked BOOLEAN DEFAULT 0,
                    unlock_date DATETIME,
                    cosmetic_data TEXT, -- JSON with cosmetic appearance data
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )";
            
            // User Vehicles table
            string createVehiclesTable = @"
                CREATE TABLE IF NOT EXISTS user_vehicles (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    vehicle_name TEXT NOT NULL,
                    vehicle_type TEXT NOT NULL,
                    color TEXT, -- HEX color
                    is_unlocked BOOLEAN DEFAULT 0,
                    unlock_date DATETIME,
                    is_favorite BOOLEAN DEFAULT 0,
                    customizations TEXT, -- JSON with vehicle customizations
                    stats TEXT, -- JSON with vehicle statistics
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )";
            
            // Game Sessions table
            string createSessionsTable = @"
                CREATE TABLE IF NOT EXISTS game_sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    session_start DATETIME DEFAULT CURRENT_TIMESTAMP,
                    session_end DATETIME,
                    duration_minutes INTEGER,
                    experience_gained INTEGER DEFAULT 0,
                    money_gained INTEGER DEFAULT 0,
                    kills INTEGER DEFAULT 0,
                    deaths INTEGER DEFAULT 0,
                    missions_completed INTEGER DEFAULT 0,
                    server_ip TEXT,
                    client_version TEXT,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )";
            
            // Kill History table
            string createKillHistoryTable = @"
                CREATE TABLE IF NOT EXISTS kill_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    killer_id INTEGER,
                    victim_id INTEGER,
                    kill_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                    weapon_used TEXT,
                    distance REAL,
                    was_headshot BOOLEAN DEFAULT 0,
                    map_location TEXT, -- JSON with coordinates
                    session_id INTEGER,
                    FOREIGN KEY (killer_id) REFERENCES users (id),
                    FOREIGN KEY (victim_id) REFERENCES users (id),
                    FOREIGN KEY (session_id) REFERENCES game_sessions (id)
                )";
            
            // Gang Kills table
            string createGangKillsTable = @"
                CREATE TABLE IF NOT EXISTS gang_kills (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    gang_type TEXT NOT NULL, -- Street Thugs, Biker Crew, etc.
                    kill_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                    weapon_used TEXT,
                    experience_gained INTEGER DEFAULT 0,
                    money_gained INTEGER DEFAULT 0,
                    session_id INTEGER,
                    FOREIGN KEY (user_id) REFERENCES users (id),
                    FOREIGN KEY (session_id) REFERENCES game_sessions (id)
                )";
            
            // Statistics table
            string createStatsTable = @"
                CREATE TABLE IF NOT EXISTS user_statistics (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    stat_name TEXT NOT NULL,
                    stat_value REAL NOT NULL,
                    stat_category TEXT, -- combat, driving, exploration, etc.
                    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )";
            
            // Leaderboard table
            string createLeaderboardTable = @"
                CREATE TABLE IF NOT EXISTS leaderboard (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    category TEXT NOT NULL, -- kills, level, money, etc.
                    score REAL NOT NULL,
                    rank INTEGER,
                    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )";
            
            // Friends table
            string createFriendsTable = @"
                CREATE TABLE IF NOT EXISTS friends (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    friend_id INTEGER NOT NULL,
                    status TEXT DEFAULT 'pending', -- pending, accepted, blocked
                    request_sent DATETIME DEFAULT CURRENT_TIMESTAMP,
                    request_accepted DATETIME,
                    FOREIGN KEY (user_id) REFERENCES users (id),
                    FOREIGN KEY (friend_id) REFERENCES users (id)
                )";
            
            // Clan table
            string createClanTable = @"
                CREATE TABLE IF NOT EXISTS clans (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE NOT NULL,
                    tag TEXT UNIQUE NOT NULL,
                    description TEXT,
                    leader_id INTEGER NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    member_count INTEGER DEFAULT 1,
                    is_public BOOLEAN DEFAULT 1,
                    clan_level INTEGER DEFAULT 1,
                    clan_experience INTEGER DEFAULT 0,
                    FOREIGN KEY (leader_id) REFERENCES users (id)
                )";
            
            // Clan Members table
            string createClanMembersTable = @"
                CREATE TABLE IF NOT EXISTS clan_members (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    clan_id INTEGER NOT NULL,
                    user_id INTEGER NOT NULL,
                    role TEXT DEFAULT 'member', -- leader, officer, member
                    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    contribution INTEGER DEFAULT 0,
                    FOREIGN KEY (clan_id) REFERENCES clans (id),
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )";
            
            // Server Logs table
            string createServerLogsTable = @"
                CREATE TABLE IF NOT EXISTS server_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    log_level TEXT NOT NULL, -- INFO, WARNING, ERROR
                    message TEXT NOT NULL,
                    user_id INTEGER,
                    ip_address TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    session_id INTEGER,
                    FOREIGN KEY (user_id) REFERENCES users (id),
                    FOREIGN KEY (session_id) REFERENCES game_sessions (id)
                )";
            
            // Execute table creation
            ExecuteNonQuery(createUsersTable);
            ExecuteNonQuery(createBattlePassTable);
            ExecuteNonQuery(createRewardsTable);
            ExecuteNonQuery(createWeaponsTable);
            ExecuteNonQuery(createCosmeticsTable);
            ExecuteNonQuery(createVehiclesTable);
            ExecuteNonQuery(createSessionsTable);
            ExecuteNonQuery(createKillHistoryTable);
            ExecuteNonQuery(createGangKillsTable);
            ExecuteNonQuery(createStatsTable);
            ExecuteNonQuery(createLeaderboardTable);
            ExecuteNonQuery(createFriendsTable);
            ExecuteNonQuery(createClanTable);
            ExecuteNonQuery(createClanMembersTable);
            ExecuteNonQuery(createServerLogsTable);
            
            // Insert default battle pass rewards
            InsertDefaultBattlePassRewards();
        }
        
        private void InsertDefaultBattlePassRewards()
        {
            // Check if rewards already exist
            var checkCmd = new SQLiteCommand("SELECT COUNT(*) FROM battle_pass_rewards", connection);
            var count = Convert.ToInt32(checkCmd.ExecuteScalar());
            
            if (count > 0) return; // Rewards already exist
            
            // Insert 100 tiers of rewards
            string[] weaponRewards = {
                "Golden Pistol", "Silver Shotgun", "Platinum Rifle", "Diamond SMG", 
                "Crystal Sniper", "Dragon RPG"
            };
            
            string[] cosmeticRewards = {
                "Red Bandana", "Gold Chain", "Diamond Watch", "Dragon Tattoo", "Phoenix Wings"
            };
            
            string[] vehicleRewards = {
                "Sports Car", "Armored Truck", "Racing Bike", "Helicopter"
            };
            
            string[] moneyRewards = {
                "$1,000", "$5,000", "$10,000", "$25,000", "$100,000"
            };
            
            string[] specialRewards = {
                "Double XP Weekend", "Exclusive Emote", "Player Title", "Custom License Plate", "VIP Status"
            };
            
            for (int tier = 1; tier <= 100; tier++)
            {
                string rewardType = "";
                string rewardName = "";
                string rarity = "common";
                bool isPremium = false;
                int rewardAmount = 0;
                
                // Determine reward based on tier
                if (tier % 5 == 0)
                {
                    if (tier % 10 == 0)
                    {
                        // Vehicle every 10 tiers
                        rewardType = "vehicle";
                        rewardName = vehicleRewards[tier % vehicleRewards.Length];
                        rarity = tier >= 75 ? "mythic" : tier >= 50 ? "legendary" : tier >= 25 ? "epic" : "rare";
                    }
                    else
                    {
                        // Weapon every 5 tiers (but not 10)
                        rewardType = "weapon";
                        rewardName = weaponRewards[tier % weaponRewards.Length];
                        rarity = tier >= 60 ? "legendary" : tier >= 30 ? "epic" : "rare";
                    }
                }
                else if (tier % 3 == 0)
                {
                    // Cosmetic every 3 tiers
                    rewardType = "cosmetic";
                    rewardName = cosmeticRewards[tier % cosmeticRewards.Length];
                    rarity = tier >= 70 ? "legendary" : tier >= 40 ? "epic" : "rare";
                }
                else if (tier % 2 == 0)
                {
                    // Money every 2 tiers
                    rewardType = "money";
                    var moneyIndex = Math.Min(tier / 20, moneyRewards.Length - 1);
                    rewardName = moneyRewards[moneyIndex];
                    rewardAmount = moneyIndex == 0 ? 1000 : moneyIndex == 1 ? 5000 : moneyIndex == 2 ? 10000 : moneyIndex == 3 ? 25000 : 100000;
                    rarity = "common";
                }
                else
                {
                    // Special rewards randomly
                    if (tier % 7 == 0)
                    {
                        rewardType = "special";
                        rewardName = specialRewards[tier % specialRewards.Length];
                        rarity = tier >= 80 ? "mythic" : tier >= 50 ? "legendary" : "epic";
                    }
                    else
                    {
                        // Default money
                        rewardType = "money";
                        rewardName = "$500";
                        rewardAmount = 500;
                        rarity = "common";
                    }
                }
                
                // Milestone rewards
                if (tier == 25)
                {
                    rewardType = "special";
                    rewardName = "MegaCity Champion";
                    rarity = "legendary";
                }
                else if (tier == 50)
                {
                    rewardType = "vehicle";
                    rewardName = "Mythic Beast";
                    rarity = "mythic";
                }
                else if (tier == 75)
                {
                    rewardType = "special";
                    rewardName = "God Mode Access";
                    rarity = "mythic";
                }
                else if (tier == 100)
                {
                    // Double rewards for tier 100
                    InsertReward(tier, "MegaCity Ruler", "special", "{\"title\": true}", "mythic", true);
                    InsertReward(tier, "Golden Throne", "vehicle", "{\"type\": \"luxury\", \"color\": \"gold\"}", "mythic", true);
                    continue;
                }
                
                string rewardData = "";
                if (rewardType == "money")
                {
                    rewardData = $"{{\"amount\": {rewardAmount}}}";
                }
                else if (rewardType == "weapon")
                {
                    rewardData = $"{{\"damage\": {50 + tier * 2}, \"range\": {50 + tier}, \"fire_rate\": {500 - tier * 3}}}";
                }
                else if (rewardType == "special")
                {
                    if (rewardName.Contains("XP"))
                        rewardData = "{\"duration\": \"48h\", \"multiplier\": 2}";
                    else if (rewardName.Contains("God Mode"))
                        rewardData = "{\"duration\": \"1h\", \"invincible\": true}";
                    else if (rewardName.Contains("VIP"))
                        rewardData = "{\"duration\": \"7d\", \"benefits\": [\"xp_boost\", \"money_boost\", \"exclusive_items\"]}";
                }
                
                InsertReward(tier, rewardName, rewardType, rewardData, rarity, isPremium);
            }
        }
        
        private void InsertReward(int tier, string name, string type, string data, string rarity, bool isPremium)
        {
            string insertReward = @"
                INSERT INTO battle_pass_rewards 
                (tier, reward_name, reward_type, reward_data, rarity, is_premium, season_number)
                VALUES (@tier, @name, @type, @data, @rarity, @premium, 1)";
            
            using (var cmd = new SQLiteCommand(insertReward, connection))
            {
                cmd.Parameters.AddWithValue("@tier", tier);
                cmd.Parameters.AddWithValue("@name", name);
                cmd.Parameters.AddWithValue("@type", type);
                cmd.Parameters.AddWithValue("@data", data);
                cmd.Parameters.AddWithValue("@rarity", rarity);
                cmd.Parameters.AddWithValue("@premium", isPremium);
                cmd.ExecuteNonQuery();
            }
        }
        
        // User Management Methods
        public bool CreateUser(string username, string email, string passwordHash, string salt)
        {
            try
            {
                string insertUser = @"
                    INSERT INTO users (username, email, password_hash, salt)
                    VALUES (@username, @email, @passwordHash, @salt)";
                
                using (var cmd = new SQLiteCommand(insertUser, connection))
                {
                    cmd.Parameters.AddWithValue("@username", username);
                    cmd.Parameters.AddWithValue("@email", email);
                    cmd.Parameters.AddWithValue("@passwordHash", passwordHash);
                    cmd.Parameters.AddWithValue("@salt", salt);
                    cmd.ExecuteNonQuery();
                }
                
                // Initialize user's battle pass
                InitializeUserBattlePass(GetUserId(username));
                
                LogInfo($"User created: {username}");
                return true;
            }
            catch (Exception ex)
            {
                LogError($"Failed to create user {username}: {ex.Message}");
                return false;
            }
        }
        
        public int GetUserId(string username)
        {
            string getUserId = "SELECT id FROM users WHERE username = @username";
            
            using (var cmd = new SQLiteCommand(getUserId, connection))
            {
                cmd.Parameters.AddWithValue("@username", username);
                var result = cmd.ExecuteScalar();
                return result != null ? Convert.ToInt32(result) : -1;
            }
        }
        
        public bool AuthenticateUser(string username, string passwordHash)
        {
            string authenticate = "SELECT COUNT(*) FROM users WHERE username = @username AND password_hash = @passwordHash AND is_banned = 0";
            
            using (var cmd = new SQLiteCommand(authenticate, connection))
            {
                cmd.Parameters.AddWithValue("@username", username);
                cmd.Parameters.AddWithValue("@passwordHash", passwordHash);
                var count = Convert.ToInt32(cmd.ExecuteScalar());
                return count > 0;
            }
        }
        
        public void UpdateLastLogin(int userId)
        {
            string updateLogin = "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = @userId";
            
            using (var cmd = new SQLiteCommand(updateLogin, connection))
            {
                cmd.Parameters.AddWithValue("@userId", userId);
                cmd.ExecuteNonQuery();
            }
        }
        
        // Battle Pass Methods
        private void InitializeUserBattlePass(int userId)
        {
            string insertBattlePass = @"
                INSERT INTO battle_pass (user_id, current_tier, experience, experience_to_next_tier, season_number)
                VALUES (@userId, 1, 0, 1000, 1)";
            
            using (var cmd = new SQLiteCommand(insertBattlePass, connection))
            {
                cmd.Parameters.AddWithValue("@userId", userId);
                cmd.ExecuteNonQuery();
            }
        }
        
        public void AddBattlePassExperience(int userId, int experience)
        {
            // Get current battle pass data
            string getBattlePass = "SELECT current_tier, experience, experience_to_next_tier FROM battle_pass WHERE user_id = @userId";
            
            using (var cmd = new SQLiteCommand(getBattlePass, connection))
            {
                cmd.Parameters.AddWithValue("@userId", userId);
                
                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        int currentTier = reader.GetInt32(0);
                        int currentExp = reader.GetInt32(1);
                        int expToNext = reader.GetInt32(2);
                        
                        currentExp += experience;
                        
                        // Check for tier up
                        while (currentExp >= expToNext && currentTier < 100)
                        {
                            currentExp -= expToNext;
                            currentTier++;
                            expToNext = currentTier * 1000;
                            
                            // Unlock rewards for new tier
                            UnlockBattlePassRewards(userId, currentTier);
                        }
                        
                        // Update battle pass
                        string updateBattlePass = @"
                            UPDATE battle_pass 
                            SET current_tier = @tier, experience = @exp, experience_to_next_tier = @expToNext
                            WHERE user_id = @userId";
                        
                        using (var updateCmd = new SQLiteCommand(updateBattlePass, connection))
                        {
                            updateCmd.Parameters.AddWithValue("@tier", currentTier);
                            updateCmd.Parameters.AddWithValue("@exp", currentExp);
                            updateCmd.Parameters.AddWithValue("@expToNext", expToNext);
                            updateCmd.Parameters.AddWithValue("@userId", userId);
                            updateCmd.ExecuteNonQuery();
                        }
                    }
                }
            }
        }
        
        private void UnlockBattlePassRewards(int userId, int tier)
        {
            string getRewards = "SELECT * FROM battle_pass_rewards WHERE tier = @tier";
            
            using (var cmd = new SQLiteCommand(getRewards, connection))
            {
                cmd.Parameters.AddWithValue("@tier", tier);
                
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        string rewardType = reader.GetString("reward_type");
                        string rewardName = reader.GetString("reward_name");
                        string rewardData = reader.GetString("reward_data");
                        
                        // Apply reward based on type
                        switch (rewardType)
                        {
                            case "weapon":
                                UnlockWeapon(userId, rewardName, rewardData);
                                break;
                            case "cosmetic":
                                UnlockCosmetic(userId, rewardName, rewardData);
                                break;
                            case "vehicle":
                                UnlockVehicle(userId, rewardName, rewardData);
                                break;
                            case "money":
                                var moneyData = System.Text.Json.JsonDocument.Parse(rewardData);
                                var amount = moneyData.RootElement.GetProperty("amount").GetInt32();
                                AddMoney(userId, amount);
                                break;
                            case "special":
                                ApplySpecialReward(userId, rewardName, rewardData);
                                break;
                        }
                    }
                }
            }
        }
        
        // Weapon Methods
        private void UnlockWeapon(int userId, string weaponName, string weaponData)
        {
            string insertWeapon = @"
                INSERT OR REPLACE INTO user_weapons 
                (user_id, weapon_name, weapon_type, damage, range, fire_rate, ammo, max_ammo, is_unlocked, unlock_date)
                VALUES (@userId, @name, @type, @damage, @range, @fireRate, 999, 999, 1, CURRENT_TIMESTAMP)";
            
            var data = System.Text.Json.JsonDocument.Parse(weaponData);
            
            using (var cmd = new SQLiteCommand(insertWeapon, connection))
            {
                cmd.Parameters.AddWithValue("@userId", userId);
                cmd.Parameters.AddWithValue("@name", weaponName);
                cmd.Parameters.AddWithValue("@type", "battle_pass");
                cmd.Parameters.AddWithValue("@damage", data.RootElement.GetProperty("damage").GetInt32());
                cmd.Parameters.AddWithValue("@range", data.RootElement.GetProperty("range").GetInt32());
                cmd.Parameters.AddWithValue("@fireRate", data.RootElement.GetProperty("fire_rate").GetInt32());
                cmd.ExecuteNonQuery();
            }
        }
        
        // Cosmetic Methods
        private void UnlockCosmetic(int userId, string cosmeticName, string cosmeticData)
        {
            string insertCosmetic = @"
                INSERT OR REPLACE INTO user_cosmetics 
                (user_id, cosmetic_name, cosmetic_type, cosmetic_slot, rarity, is_unlocked, unlock_date)
                VALUES (@userId, @name, 'battle_pass', 'head', 'rare', 1, CURRENT_TIMESTAMP)";
            
            using (var cmd = new SQLiteCommand(insertCosmetic, connection))
            {
                cmd.Parameters.AddWithValue("@userId", userId);
                cmd.Parameters.AddWithValue("@name", cosmeticName);
                cmd.ExecuteNonQuery();
            }
        }
        
        // Vehicle Methods
        private void UnlockVehicle(int userId, string vehicleName, string vehicleData)
        {
            string insertVehicle = @"
                INSERT OR REPLACE INTO user_vehicles 
                (user_id, vehicle_name, vehicle_type, is_unlocked, unlock_date)
                VALUES (@userId, @name, 'battle_pass', 1, CURRENT_TIMESTAMP)";
            
            using (var cmd = new SQLiteCommand(insertVehicle, connection))
            {
                cmd.Parameters.AddWithValue("@userId", userId);
                cmd.Parameters.AddWithValue("@name", vehicleName);
                cmd.ExecuteNonQuery();
            }
        }
        
        // Money Methods
        public void AddMoney(int userId, int amount)
        {
            string updateMoney = "UPDATE users SET money = money + @amount WHERE id = @userId";
            
            using (var cmd = new SQLiteCommand(updateMoney, connection))
            {
                cmd.Parameters.AddWithValue("@amount", amount);
                cmd.Parameters.AddWithValue("@userId", userId);
                cmd.ExecuteNonQuery();
            }
        }
        
        // Special Reward Methods
        private void ApplySpecialReward(int userId, string rewardName, string rewardData)
        {
            switch (rewardName)
            {
                case "Double XP Weekend":
                    ActivateDoubleXP(userId, 48);
                    break;
                case "God Mode Access":
                    ActivateGodMode(userId, 1);
                    break;
                case "VIP Status":
                    ActivateVIP(userId, 7);
                    break;
            }
        }
        
        private void ActivateDoubleXP(int userId, int hours)
        {
            string updateVIP = @"
                UPDATE users SET vip_status = 1, vip_expires = datetime('now', '+' || @hours || ' hours') 
                WHERE id = @userId";
            
            using (var cmd = new SQLiteCommand(updateVIP, connection))
            {
                cmd.Parameters.AddWithValue("@hours", hours);
                cmd.Parameters.AddWithValue("@userId", userId);
                cmd.ExecuteNonQuery();
            }
        }
        
        private void ActivateGodMode(int userId, int hours)
        {
            // Store god mode activation in user statistics
            string insertStat = @"
                INSERT OR REPLACE INTO user_statistics 
                (user_id, stat_name, stat_value, stat_category)
                VALUES (@userId, 'god_mode_expires', @expires, 'special')";
            
            var expires = DateTime.Now.AddHours(hours).ToString("yyyy-MM-dd HH:mm:ss");
            
            using (var cmd = new SQLiteCommand(insertStat, connection))
            {
                cmd.Parameters.AddWithValue("@userId", userId);
                cmd.Parameters.AddWithValue("@expires", expires);
                cmd.ExecuteNonQuery();
            }
        }
        
        private void ActivateVIP(int userId, int days)
        {
            string updateVIP = @"
                UPDATE users SET vip_status = 1, vip_expires = datetime('now', '+' || @days || ' days') 
                WHERE id = @userId";
            
            using (var cmd = new SQLiteCommand(updateVIP, connection))
            {
                cmd.Parameters.AddWithValue("@days", days);
                cmd.Parameters.AddWithValue("@userId", userId);
                cmd.ExecuteNonQuery();
            }
        }
        
        // Game Session Methods
        public int StartGameSession(int userId, string serverIP, string clientVersion)
        {
            string insertSession = @"
                INSERT INTO game_sessions (user_id, server_ip, client_version)
                VALUES (@userId, @serverIP, @clientVersion);
                SELECT last_insert_rowid();";
            
            using (var cmd = new SQLiteCommand(insertSession, connection))
            {
                cmd.Parameters.AddWithValue("@userId", userId);
                cmd.Parameters.AddWithValue("@serverIP", serverIP);
                cmd.Parameters.AddWithValue("@clientVersion", clientVersion);
                
                var sessionId = Convert.ToInt32(cmd.ExecuteScalar());
                LogInfo($"Game session started for user {userId}, session ID: {sessionId}");
                return sessionId;
            }
        }
        
        public void EndGameSession(int sessionId, int experienceGained, int moneyGained, int kills, int deaths, int missionsCompleted)
        {
            string updateSession = @"
                UPDATE game_sessions 
                SET session_end = CURRENT_TIMESTAMP,
                    duration_minutes = CAST(julianday(CURRENT_TIMESTAMP) - julianday(session_start) * 24 * 60 AS INTEGER),
                    experience_gained = @expGained,
                    money_gained = @moneyGained,
                    kills = @kills,
                    deaths = @deaths,
                    missions_completed = @missionsCompleted
                WHERE id = @sessionId";
            
            using (var cmd = new SQLiteCommand(updateSession, connection))
            {
                cmd.Parameters.AddWithValue("@expGained", experienceGained);
                cmd.Parameters.AddWithValue("@moneyGained", moneyGained);
                cmd.Parameters.AddWithValue("@kills", kills);
                cmd.Parameters.AddWithValue("@deaths", deaths);
                cmd.Parameters.AddWithValue("@missionsCompleted", missionsCompleted);
                cmd.Parameters.AddWithValue("@sessionId", sessionId);
                cmd.ExecuteNonQuery();
            }
            
            // Update user statistics
            var userId = GetUserIdFromSession(sessionId);
            if (userId > 0)
            {
                UpdateUserStatistics(userId, experienceGained, moneyGained, kills, deaths);
            }
        }
        
        private int GetUserIdFromSession(int sessionId)
        {
            string getUserId = "SELECT user_id FROM game_sessions WHERE id = @sessionId";
            
            using (var cmd = new SQLiteCommand(getUserId, connection))
            {
                cmd.Parameters.AddWithValue("@sessionId", sessionId);
                var result = cmd.ExecuteScalar();
                return result != null ? Convert.ToInt32(result) : -1;
            }
        }
        
        private void UpdateUserStatistics(int userId, int experienceGained, int moneyGained, int kills, int deaths)
        {
            string updateStats = @"
                UPDATE users 
                SET experience = experience + @expGained,
                    money = money + @moneyGained,
                    kills = kills + @kills,
                    deaths = deaths + @deaths,
                    total_playtime = total_playtime + 1
                WHERE id = @userId";
            
            using (var cmd = new SQLiteCommand(updateStats, connection))
            {
                cmd.Parameters.AddWithValue("@expGained", experienceGained);
                cmd.Parameters.AddWithValue("@moneyGained", moneyGained);
                cmd.Parameters.AddWithValue("@kills", kills);
                cmd.Parameters.AddWithValue("@deaths", deaths);
                cmd.Parameters.AddWithValue("@userId", userId);
                cmd.ExecuteNonQuery();
            }
            
            // Add battle pass experience
            AddBattlePassExperience(userId, experienceGained);
        }
        
        // Gang Kill Methods
        public void RecordGangKill(int userId, string gangType, string weaponUsed, int experienceGained, int moneyGained, int sessionId)
        {
            string insertKill = @"
                INSERT INTO gang_kills (user_id, gang_type, kill_time, weapon_used, experience_gained, money_gained, session_id)
                VALUES (@userId, @gangType, CURRENT_TIMESTAMP, @weapon, @expGained, @moneyGained, @sessionId)";
            
            using (var cmd = new SQLiteCommand(insertKill, connection))
            {
                cmd.Parameters.AddWithValue("@userId", userId);
                cmd.Parameters.AddWithValue("@gangType", gangType);
                cmd.Parameters.AddWithValue("@weapon", weaponUsed);
                cmd.Parameters.AddWithValue("@expGained", experienceGained);
                cmd.Parameters.AddWithValue("@moneyGained", moneyGained);
                cmd.Parameters.AddWithValue("@sessionId", sessionId);
                cmd.ExecuteNonQuery();
            }
        }
        
        // Kill History Methods
        public void RecordPlayerKill(int killerId, int victimId, string weaponUsed, double distance, bool wasHeadshot, int sessionId)
        {
            string insertKill = @"
                INSERT INTO kill_history 
                (killer_id, victim_id, weapon_used, distance, was_headshot, map_location, session_id)
                VALUES (@killerId, @victimId, @weapon, @distance, @headshot, 'null', @sessionId)";
            
            using (var cmd = new SQLiteCommand(insertKill, connection))
            {
                cmd.Parameters.AddWithValue("@killerId", killerId);
                cmd.Parameters.AddWithValue("@victimId", victimId);
                cmd.Parameters.AddWithValue("@weapon", weaponUsed);
                cmd.Parameters.AddWithValue("@distance", distance);
                cmd.Parameters.AddWithValue("@headshot", wasHeadshot);
                cmd.Parameters.AddWithValue("@sessionId", sessionId);
                cmd.ExecuteNonQuery();
            }
        }
        
        // Leaderboard Methods
        public void UpdateLeaderboard(int userId, string category, double score)
        {
            string insertOrUpdate = @"
                INSERT OR REPLACE INTO leaderboard 
                (user_id, category, score, last_updated)
                VALUES (@userId, @category, @score, CURRENT_TIMESTAMP)";
            
            using (var cmd = new SQLiteCommand(insertOrUpdate, connection))
            {
                cmd.Parameters.AddWithValue("@userId", userId);
                cmd.Parameters.AddWithValue("@category", category);
                cmd.Parameters.AddWithValue("@score", score);
                cmd.ExecuteNonQuery();
            }
        }
        
        public List<Dictionary<string, object>> GetLeaderboard(string category, int limit = 10)
        {
            string getLeaderboard = @"
                SELECT u.username, l.score, l.rank
                FROM leaderboard l
                JOIN users u ON l.user_id = u.id
                WHERE l.category = @category
                ORDER BY l.score DESC
                LIMIT @limit";
            
            var results = new List<Dictionary<string, object>>();
            
            using (var cmd = new SQLiteCommand(getLeaderboard, connection))
            {
                cmd.Parameters.AddWithValue("@category", category);
                cmd.Parameters.AddWithValue("@limit", limit);
                
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var row = new Dictionary<string, object>
                        {
                            ["username"] = reader.GetString("username"),
                            ["score"] = reader.GetDouble("score"),
                            ["rank"] = reader.GetInt32("rank")
                        };
                        results.Add(row);
                    }
                }
            }
            
            return results;
        }
        
        // Logging Methods
        public void LogInfo(string message, int? userId = null, string ipAddress = null, int? sessionId = null)
        {
            LogMessage("INFO", message, userId, ipAddress, sessionId);
        }
        
        public void LogWarning(string message, int? userId = null, string ipAddress = null, int? sessionId = null)
        {
            LogMessage("WARNING", message, userId, ipAddress, sessionId);
        }
        
        public void LogError(string message, int? userId = null, string ipAddress = null, int? sessionId = null)
        {
            LogMessage("ERROR", message, userId, ipAddress, sessionId);
        }
        
        private void LogMessage(string level, string message, int? userId, string ipAddress, int? sessionId)
        {
            string insertLog = @"
                INSERT INTO server_logs (log_level, message, user_id, ip_address, session_id)
                VALUES (@level, @message, @userId, @ip, @sessionId)";
            
            using (var cmd = new SQLiteCommand(insertLog, connection))
            {
                cmd.Parameters.AddWithValue("@level", level);
                cmd.Parameters.AddWithValue("@message", message);
                cmd.Parameters.AddWithValue("@userId", userId ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@ip", ipAddress ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@sessionId", sessionId ?? (object)DBNull.Value);
                cmd.ExecuteNonQuery();
            }
        }
        
        // Utility Methods
        private void ExecuteNonQuery(string sql)
        {
            using (var cmd = new SQLiteCommand(sql, connection))
            {
                cmd.ExecuteNonQuery();
            }
        }
        
        public void Close()
        {
            if (connection != null && connection.State == ConnectionState.Open)
            {
                connection.Close();
                Console.WriteLine("🗄️ Database connection closed");
            }
        }
        
        // Query Methods for Game Data
        public Dictionary<string, object> GetUserGameData(int userId)
        {
            string getUserData = @"
                SELECT u.*, bp.current_tier, bp.experience as battle_pass_exp, bp.unlocked_rewards
                FROM users u
                LEFT JOIN battle_pass bp ON u.id = bp.user_id
                WHERE u.id = @userId";
            
            using (var cmd = new SQLiteCommand(getUserData, connection))
            {
                cmd.Parameters.AddWithValue("@userId", userId);
                
                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return new Dictionary<string, object>
                        {
                            ["username"] = reader.GetString("username"),
                            ["level"] = reader.GetInt32("level"),
                            ["experience"] = reader.GetInt32("experience"),
                            ["money"] = reader.GetInt32("money"),
                            ["bank_money"] = reader.GetInt32("bank_money"),
                            ["kills"] = reader.GetInt32("kills"),
                            ["deaths"] = reader.GetInt32("deaths"),
                            ["current_tier"] = reader.GetInt32("current_tier"),
                            ["battle_pass_exp"] = reader.GetInt32("battle_pass_exp"),
                            ["vip_status"] = reader.GetBoolean("vip_status")
                        };
                    }
                }
            }
            
            return null;
        }
        
        public List<Dictionary<string, object>> GetUserWeapons(int userId)
        {
            string getWeapons = @"
                SELECT * FROM user_weapons WHERE user_id = @userId AND is_unlocked = 1";
            
            var weapons = new List<Dictionary<string, object>>();
            
            using (var cmd = new SQLiteCommand(getWeapons, connection))
            {
                cmd.Parameters.AddWithValue("@userId", userId);
                
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        weapons.Add(new Dictionary<string, object>
                        {
                            ["weapon_name"] = reader.GetString("weapon_name"),
                            ["weapon_type"] = reader.GetString("weapon_type"),
                            ["damage"] = reader.GetInt32("damage"),
                            ["range"] = reader.GetInt32("range"),
                            ["fire_rate"] = reader.GetInt32("fire_rate"),
                            ["ammo"] = reader.GetInt32("ammo"),
                            ["max_ammo"] = reader.GetInt32("max_ammo")
                        });
                    }
                }
            }
            
            return weapons;
        }
        
        public List<Dictionary<string, object>> GetUserCosmetics(int userId)
        {
            string getCosmetics = @"
                SELECT * FROM user_cosmetics WHERE user_id = @userId AND is_unlocked = 1";
            
            var cosmetics = new List<Dictionary<string, object>>();
            
            using (var cmd = new SQLiteCommand(getCosmetics, connection))
            {
                cmd.Parameters.AddWithValue("@userId", userId);
                
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        cosmetics.Add(new Dictionary<string, object>
                        {
                            ["cosmetic_name"] = reader.GetString("cosmetic_name"),
                            ["cosmetic_type"] = reader.GetString("cosmetic_type"),
                            ["cosmetic_slot"] = reader.GetString("cosmetic_slot"),
                            ["rarity"] = reader.GetString("rarity"),
                            ["is_equipped"] = reader.GetBoolean("is_equipped")
                        });
                    }
                }
            }
            
            return cosmetics;
        }
        
        public List<Dictionary<string, object>> GetUserVehicles(int userId)
        {
            string getVehicles = @"
                SELECT * FROM user_vehicles WHERE user_id = @userId AND is_unlocked = 1";
            
            var vehicles = new List<Dictionary<string, object>>();
            
            using (var cmd = new SQLiteCommand(getVehicles, connection))
            {
                cmd.Parameters.AddWithValue("@userId", userId);
                
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        vehicles.Add(new Dictionary<string, object>
                        {
                            ["vehicle_name"] = reader.GetString("vehicle_name"),
                            ["vehicle_type"] = reader.GetString("vehicle_type"),
                            ["color"] = reader["color"] as string,
                            ["is_favorite"] = reader.GetBoolean("is_favorite")
                        });
                    }
                }
            }
            
            return vehicles;
        }
    }
}

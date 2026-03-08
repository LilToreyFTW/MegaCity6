-- MegaCity6 Database Schema

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  money INTEGER DEFAULT 1000,
  bank_money INTEGER DEFAULT 5000,
  health INTEGER DEFAULT 100,
  armor INTEGER DEFAULT 0,
  wanted_level INTEGER DEFAULT 0,
  current_weapon VARCHAR(20) DEFAULT 'pistol',
  position_x FLOAT DEFAULT 0,
  position_y FLOAT DEFAULT 0,
  position_z FLOAT DEFAULT 0,
  is_online BOOLEAN DEFAULT false
);

-- Game statistics
CREATE TABLE IF NOT EXISTS game_stats (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  stat_name VARCHAR(50) NOT NULL,
  stat_value INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Battle pass progress
CREATE TABLE IF NOT EXISTS battle_pass (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  current_tier INTEGER DEFAULT 1,
  current_xp INTEGER DEFAULT 0,
  season_number INTEGER DEFAULT 1,
  rewards_claimed TEXT[], -- Array of claimed reward IDs
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gangs
CREATE TABLE IF NOT EXISTS gangs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  leader_id INTEGER REFERENCES players(id),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  member_count INTEGER DEFAULT 1,
  territory_controlled INTEGER DEFAULT 0
);

-- Gang memberships
CREATE TABLE IF NOT EXISTS gang_members (
  id SERIAL PRIMARY KEY,
  gang_id INTEGER REFERENCES gangs(id),
  player_id INTEGER REFERENCES players(id),
  role VARCHAR(20) DEFAULT 'member', -- leader, officer, member
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(gang_id, player_id)
);

-- Weapons inventory
CREATE TABLE IF NOT EXISTS player_weapons (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  weapon_type VARCHAR(20) NOT NULL,
  ammo INTEGER DEFAULT 0,
  unlocked BOOLEAN DEFAULT false,
  purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Game sessions
CREATE TABLE IF NOT EXISTS game_sessions (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  session_end TIMESTAMP,
  duration_minutes INTEGER,
  money_earned INTEGER DEFAULT 0,
  xp_gained INTEGER DEFAULT 0,
  missions_completed INTEGER DEFAULT 0
);

-- Leaderboard
CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id),
  category VARCHAR(20) NOT NULL, -- level, money, kills, missions
  score INTEGER NOT NULL,
  rank_position INTEGER,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Multiplayer rooms
CREATE TABLE IF NOT EXISTS multiplayer_rooms (
  id SERIAL PRIMARY KEY,
  room_name VARCHAR(50) NOT NULL,
  host_id INTEGER REFERENCES players(id),
  max_players INTEGER DEFAULT 10,
  current_players INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  game_mode VARCHAR(20) DEFAULT 'free_roam'
);

-- Room participants
CREATE TABLE IF NOT EXISTS room_participants (
  id SERIAL PRIMARY KEY,
  room_id INTEGER REFERENCES multiplayer_rooms(id),
  player_id INTEGER REFERENCES players(id),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_ready BOOLEAN DEFAULT false,
  UNIQUE(room_id, player_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_players_username ON players(username);
CREATE INDEX IF NOT EXISTS idx_players_online ON players(is_online);
CREATE INDEX IF NOT EXISTS idx_gang_members_gang ON gang_members(gang_id);
CREATE INDEX IF NOT EXISTS idx_game_stats_player ON game_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_battle_pass_player ON battle_pass(player_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_category ON leaderboard(category, score DESC);

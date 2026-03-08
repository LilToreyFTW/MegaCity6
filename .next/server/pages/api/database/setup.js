"use strict";(()=>{var e={};e.id=218,e.ids=[218],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},8048:e=>{e.exports=import("@neondatabase/serverless")},6249:(e,a)=>{Object.defineProperty(a,"l",{enumerable:!0,get:function(){return function e(a,E){return E in a?a[E]:"then"in a&&"function"==typeof a.then?a.then(a=>e(a,E)):"function"==typeof a&&"default"===E?a:void 0}}})},6674:(e,a,E)=>{E.a(e,async(e,t)=>{try{E.r(a),E.d(a,{config:()=>A,default:()=>o,routeModule:()=>l});var s=E(1802),r=E(7153),T=E(6249),n=E(9335),i=e([n]);n=(i.then?(await i)():i)[0];let o=(0,T.l)(n,"default"),A=(0,T.l)(n,"config"),l=new s.PagesAPIRouteModule({definition:{kind:r.x.PAGES_API,page:"/api/database/setup",pathname:"/api/database/setup",bundlePath:"",filename:""},userland:n});t()}catch(e){t(e)}})},5015:(e,a,E)=>{E.a(e,async(e,t)=>{try{E.d(a,{M:()=>T,i:()=>i});var s=E(8048),r=e([s]);s=(r.then?(await r)():r)[0];let n=process.env.DATABASE_URL||"postgresql://neondb_owner:npg_h9vSUbw2kNWy@ep-square-cake-aklrmj4p-pooler.c-3.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";if(!n)throw Error("DATABASE_URL is not set");let i=(0,s.neon)(n);async function T(){try{let e=await i`SELECT version()`;return console.log("Database connected successfully:",e[0]),!0}catch(e){return console.error("Database connection failed:",e),!1}}t()}catch(e){t(e)}})},9335:(e,a,E)=>{E.a(e,async(e,t)=>{try{E.r(a),E.d(a,{default:()=>T});var s=E(5015),r=e([s]);async function T(e,a){if(a.setHeader("Access-Control-Allow-Origin","*"),a.setHeader("Access-Control-Allow-Methods","POST, OPTIONS"),a.setHeader("Access-Control-Allow-Headers","Content-Type"),"OPTIONS"===e.method)return a.status(200).end();if("POST"!==e.method)return a.status(405).json({error:"Method not allowed"});try{if(!await (0,s.M)())return a.status(500).json({error:"Database connection failed"});try{await (0,s.i)`CREATE TABLE IF NOT EXISTS players (
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
      )`,await (0,s.i)`CREATE TABLE IF NOT EXISTS game_stats (
        id SERIAL PRIMARY KEY,
        player_id INTEGER REFERENCES players(id),
        stat_name VARCHAR(50) NOT NULL,
        stat_value INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,await (0,s.i)`CREATE TABLE IF NOT EXISTS battle_pass (
        id SERIAL PRIMARY KEY,
        player_id INTEGER REFERENCES players(id),
        current_tier INTEGER DEFAULT 1,
        current_xp INTEGER DEFAULT 0,
        season_number INTEGER DEFAULT 1,
        rewards_claimed TEXT[],
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,await (0,s.i)`CREATE TABLE IF NOT EXISTS player_weapons (
        id SERIAL PRIMARY KEY,
        player_id INTEGER REFERENCES players(id),
        weapon_type VARCHAR(20) NOT NULL,
        ammo INTEGER DEFAULT 0,
        unlocked BOOLEAN DEFAULT false,
        purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,await (0,s.i)`CREATE TABLE IF NOT EXISTS game_sessions (
        id SERIAL PRIMARY KEY,
        player_id INTEGER REFERENCES players(id),
        session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        session_end TIMESTAMP,
        duration_minutes INTEGER,
        money_earned INTEGER DEFAULT 0,
        xp_gained INTEGER DEFAULT 0,
        missions_completed INTEGER DEFAULT 0
      )`,await (0,s.i)`CREATE TABLE IF NOT EXISTS leaderboard (
        id SERIAL PRIMARY KEY,
        player_id INTEGER REFERENCES players(id),
        category VARCHAR(20) NOT NULL,
        score INTEGER NOT NULL,
        rank_position INTEGER,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,await (0,s.i)`CREATE INDEX IF NOT EXISTS idx_players_username ON players(username)`,await (0,s.i)`CREATE INDEX IF NOT EXISTS idx_players_online ON players(is_online)`,await (0,s.i)`CREATE INDEX IF NOT EXISTS idx_game_stats_player ON game_stats(player_id)`,await (0,s.i)`CREATE INDEX IF NOT EXISTS idx_battle_pass_player ON battle_pass(player_id)`,await (0,s.i)`CREATE INDEX IF NOT EXISTS idx_game_sessions_player ON game_sessions(player_id)`}catch(e){throw console.error("Schema creation error:",e),e}a.status(200).json({success:!0,message:"Database schema created successfully"})}catch(e){console.error("Database setup error:",e),a.status(500).json({error:"Failed to setup database",details:e.message})}}s=(r.then?(await r)():r)[0],t()}catch(e){t(e)}})},7153:(e,a)=>{var E;Object.defineProperty(a,"x",{enumerable:!0,get:function(){return E}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(E||(E={}))},1802:(e,a,E)=>{e.exports=E(145)}};var a=require("../../../webpack-api-runtime.js");a.C(e);var E=a(a.s=6674);module.exports=E})();
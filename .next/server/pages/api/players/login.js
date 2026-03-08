"use strict";(()=>{var e={};e.id=512,e.ids=[512],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},8048:e=>{e.exports=import("@neondatabase/serverless")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,a){return a in t?t[a]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,a)):"function"==typeof t&&"default"===a?t:void 0}}})},6273:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{config:()=>c,default:()=>u,routeModule:()=>d});var n=a(1802),s=a(7153),o=a(6249),i=a(3752),l=e([i]);i=(l.then?(await l)():l)[0];let u=(0,o.l)(i,"default"),c=(0,o.l)(i,"config"),d=new n.PagesAPIRouteModule({definition:{kind:s.x.PAGES_API,page:"/api/players/login",pathname:"/api/players/login",bundlePath:"",filename:""},userland:i});r()}catch(e){r(e)}})},5015:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.d(t,{M:()=>o,i:()=>i});var n=a(8048),s=e([n]);if(n=(s.then?(await s)():s)[0],!process.env.DATABASE_URL)throw Error("DATABASE_URL is not set");let i=(0,n.neon)(process.env.DATABASE_URL);async function o(){try{let e=await i`SELECT version()`;return console.log("Database connected successfully:",e[0]),!0}catch(e){return console.error("Database connection failed:",e),!1}}r()}catch(e){r(e)}})},3752:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{default:()=>o});var n=a(5015),s=e([n]);async function o(e,t){if("POST"!==e.method)return t.status(405).json({error:"Method not allowed"});try{let{username:a}=e.body;if(!a)return t.status(400).json({error:"Username is required"});let r=await (0,n.i)`
      SELECT id, username, money, bank_money, level, experience, health, armor, 
             wanted_level, current_weapon, position_x, position_y, position_z
      FROM players 
      WHERE username = ${a}
    `;if(0===r.length)return t.status(404).json({error:"Player not found"});let s=await (0,n.i)`
      SELECT stat_name, stat_value FROM game_stats WHERE player_id = ${r[0].id}
    `,o=await (0,n.i)`
      SELECT current_tier, current_xp, season_number, rewards_claimed
      FROM battle_pass WHERE player_id = ${r[0].id}
    `,i=await (0,n.i)`
      SELECT weapon_type, ammo, unlocked FROM player_weapons WHERE player_id = ${r[0].id}
    `;await (0,n.i)`
      UPDATE players 
      SET last_login = CURRENT_TIMESTAMP, is_online = true
      WHERE id = ${r[0].id}
    `,await (0,n.i)`
      INSERT INTO game_sessions (player_id, session_start)
      VALUES (${r[0].id})
    `;let l={...r[0],stats:s.reduce((e,t)=>(e[t.stat_name]=t.stat_value,e),{}),battlePass:o[0]||{current_tier:1,current_xp:0,season_number:1},weapons:i.reduce((e,t)=>(e[t.weapon_type]={ammo:t.ammo,unlocked:t.unlocked},e),{})};t.status(200).json({success:!0,player:l,message:"Login successful"})}catch(e){console.error("Login error:",e),t.status(500).json({error:"Login failed",details:e.message})}}n=(s.then?(await s)():s)[0],r()}catch(e){r(e)}})},7153:(e,t)=>{var a;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return a}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(a||(a={}))},1802:(e,t,a)=>{e.exports=a(145)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var a=t(t.s=6273);module.exports=a})();
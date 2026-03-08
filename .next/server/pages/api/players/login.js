"use strict";(()=>{var e={};e.id=512,e.ids=[512],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},8048:e=>{e.exports=import("@neondatabase/serverless")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},6273:(e,t,r)=>{r.a(e,async(e,n)=>{try{r.r(t),r.d(t,{config:()=>c,default:()=>u,routeModule:()=>d});var a=r(1802),s=r(7153),o=r(6249),i=r(3752),l=e([i]);i=(l.then?(await l)():l)[0];let u=(0,o.l)(i,"default"),c=(0,o.l)(i,"config"),d=new a.PagesAPIRouteModule({definition:{kind:s.x.PAGES_API,page:"/api/players/login",pathname:"/api/players/login",bundlePath:"",filename:""},userland:i});n()}catch(e){n(e)}})},5015:(e,t,r)=>{r.a(e,async(e,n)=>{try{r.d(t,{M:()=>o,i:()=>l});var a=r(8048),s=e([a]);a=(s.then?(await s)():s)[0];let i=process.env.DATABASE_URL||"postgresql://neondb_owner:npg_h9vSUbw2kNWy@ep-square-cake-aklrmj4p-pooler.c-3.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";if(!i)throw Error("DATABASE_URL is not set");let l=(0,a.neon)(i);async function o(){try{let e=await l`SELECT version()`;return console.log("Database connected successfully:",e[0]),!0}catch(e){return console.error("Database connection failed:",e),!1}}n()}catch(e){n(e)}})},3752:(e,t,r)=>{r.a(e,async(e,n)=>{try{r.r(t),r.d(t,{default:()=>o});var a=r(5015),s=e([a]);async function o(e,t){if(t.setHeader("Access-Control-Allow-Origin","*"),t.setHeader("Access-Control-Allow-Methods","POST, OPTIONS"),t.setHeader("Access-Control-Allow-Headers","Content-Type"),"OPTIONS"===e.method)return t.status(200).end();if("POST"!==e.method)return t.status(405).json({error:"Method not allowed"});try{let{username:r}=e.body;if(!r)return t.status(400).json({error:"Username is required"});let n=await (0,a.i)`
      SELECT id, username, money, bank_money, level, experience, health, armor, 
             wanted_level, current_weapon, position_x, position_y, position_z
      FROM players 
      WHERE username = ${r}
    `;if(0===n.length)return t.status(404).json({error:"Player not found"});let s=await (0,a.i)`
      SELECT stat_name, stat_value FROM game_stats WHERE player_id = ${n[0].id}
    `,o=await (0,a.i)`
      SELECT current_tier, current_xp, season_number, rewards_claimed
      FROM battle_pass WHERE player_id = ${n[0].id}
    `,i=await (0,a.i)`
      SELECT weapon_type, ammo, unlocked FROM player_weapons WHERE player_id = ${n[0].id}
    `;await (0,a.i)`
      UPDATE players 
      SET last_login = CURRENT_TIMESTAMP, is_online = true
      WHERE id = ${n[0].id}
    `,await (0,a.i)`
      INSERT INTO game_sessions (player_id, session_start)
      VALUES (${n[0].id}, CURRENT_TIMESTAMP)
    `;let l={...n[0],stats:s.reduce((e,t)=>(e[t.stat_name]=t.stat_value,e),{}),battlePass:o[0]||{current_tier:1,current_xp:0,season_number:1},weapons:i.reduce((e,t)=>(e[t.weapon_type]={ammo:t.ammo,unlocked:t.unlocked},e),{})};t.status(200).json({success:!0,player:l,message:"Login successful"})}catch(e){console.error("Login error:",e),t.status(500).json({error:"Login failed",details:e.message})}}a=(s.then?(await s)():s)[0],n()}catch(e){n(e)}})},7153:(e,t)=>{var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},1802:(e,t,r)=>{e.exports=r(145)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var r=t(t.s=6273);module.exports=r})();
"use strict";(()=>{var e={};e.id=283,e.ids=[283],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},8048:e=>{e.exports=import("@neondatabase/serverless")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,a){return a in t?t[a]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,a)):"function"==typeof t&&"default"===a?t:void 0}}})},5465:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{config:()=>d,default:()=>u,routeModule:()=>c});var s=a(1802),n=a(7153),i=a(6249),o=a(774),l=e([o]);o=(l.then?(await l)():l)[0];let u=(0,i.l)(o,"default"),d=(0,i.l)(o,"config"),c=new s.PagesAPIRouteModule({definition:{kind:n.x.PAGES_API,page:"/api/players/register",pathname:"/api/players/register",bundlePath:"",filename:""},userland:o});r()}catch(e){r(e)}})},5015:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.d(t,{M:()=>i,i:()=>o});var s=a(8048),n=e([s]);if(s=(n.then?(await n)():n)[0],!process.env.DATABASE_URL)throw Error("DATABASE_URL is not set");let o=(0,s.neon)(process.env.DATABASE_URL);async function i(){try{let e=await o`SELECT version()`;return console.log("Database connected successfully:",e[0]),!0}catch(e){return console.error("Database connection failed:",e),!1}}r()}catch(e){r(e)}})},774:(e,t,a)=>{a.a(e,async(e,r)=>{try{a.r(t),a.d(t,{default:()=>i});var s=a(5015),n=e([s]);async function i(e,t){if("POST"!==e.method)return t.status(405).json({error:"Method not allowed"});try{let{username:a,email:r,password:n}=e.body;if(!a||a.length<3)return t.status(400).json({error:"Username must be at least 3 characters"});if((await (0,s.i)`
      SELECT id FROM players WHERE username = ${a}
    `).length>0)return t.status(400).json({error:"Username already taken"});let i=await (0,s.i)`
      INSERT INTO players (username, email, is_online, created_at)
      VALUES (${a}, ${r||null}, true, CURRENT_TIMESTAMP)
      RETURNING id, username, money, bank_money, level, experience, created_at
    `;await (0,s.i)`
      INSERT INTO game_stats (player_id, stat_name, stat_value)
      VALUES 
        (${i[0].id}, 'total_playtime', 0),
        (${i[0].id}, 'missions_completed', 0),
        (${i[0].id}, 'total_kills', 0),
        (${i[0].id}, 'deaths', 0)
    `,await (0,s.i)`
      INSERT INTO battle_pass (player_id, current_tier, current_xp, season_number)
      VALUES (${i[0].id}, 1, 0, 1)
    `,await (0,s.i)`
      INSERT INTO player_weapons (player_id, weapon_type, ammo, unlocked)
      VALUES 
        (${i[0].id}, 'pistol', 999, true),
        (${i[0].id}, 'shotgun', 0, false),
        (${i[0].id}, 'rifle', 0, false),
        (${i[0].id}, 'smg', 0, false),
        (${i[0].id}, 'sniper', 0, false),
        (${i[0].id}, 'rpg', 0, false)
    `,t.status(201).json({success:!0,player:i[0],message:"Player registered successfully"})}catch(e){console.error("Registration error:",e),t.status(500).json({error:"Registration failed",details:e.message})}}s=(n.then?(await n)():n)[0],r()}catch(e){r(e)}})},7153:(e,t)=>{var a;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return a}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(a||(a={}))},1802:(e,t,a)=>{e.exports=a(145)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var a=t(t.s=5465);module.exports=a})();
"use strict";(()=>{var e={};e.id=950,e.ids=[950],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},8048:e=>{e.exports=import("@neondatabase/serverless")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},4010:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{config:()=>u,default:()=>c,routeModule:()=>d});var n=r(1802),s=r(7153),o=r(6249),l=r(7022),i=e([l]);l=(i.then?(await i)():i)[0];let c=(0,o.l)(l,"default"),u=(0,o.l)(l,"config"),d=new n.PagesAPIRouteModule({definition:{kind:s.x.PAGES_API,page:"/api/leaderboard/get",pathname:"/api/leaderboard/get",bundlePath:"",filename:""},userland:l});a()}catch(e){a(e)}})},5015:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.d(t,{M:()=>o,i:()=>l});var n=r(8048),s=e([n]);if(n=(s.then?(await s)():s)[0],!process.env.DATABASE_URL)throw Error("DATABASE_URL is not set");let l=(0,n.neon)(process.env.DATABASE_URL);async function o(){try{let e=await l`SELECT version()`;return console.log("Database connected successfully:",e[0]),!0}catch(e){return console.error("Database connection failed:",e),!1}}a()}catch(e){a(e)}})},7022:(e,t,r)=>{r.a(e,async(e,a)=>{try{r.r(t),r.d(t,{default:()=>o});var n=r(5015),s=e([n]);async function o(e,t){if("GET"!==e.method)return t.status(405).json({error:"Method not allowed"});try{let{category:r="level",limit:a=10}=e.query;if(!["level","money","experience","missions_completed","total_kills"].includes(r))return t.status(400).json({error:"Invalid category"});let s="",o=[];"money"===r?(s=`
        SELECT p.username, p.money as score, p.level, p.created_at
        FROM players p
        WHERE p.money > 0
        ORDER BY p.money DESC
        LIMIT $1
      `,o=[parseInt(a)]):"level"===r||"experience"===r?(s=`
        SELECT p.username, p.${r} as score, p.money, p.created_at
        FROM players p
        ORDER BY p.${r} DESC
        LIMIT $1
      `,o=[parseInt(a)]):(s=`
        SELECT p.username, gs.stat_value as score, p.level, p.money
        FROM players p
        JOIN game_stats gs ON p.id = gs.player_id
        WHERE gs.stat_name = $1
        ORDER BY gs.stat_value DESC
        LIMIT $2
      `,o=[r,parseInt(a)]);let l=(await n.i.query(s,o)).rows.map((e,t)=>({rank:t+1,username:e.username,score:e.score,level:e.level,money:e.money||0,created_at:e.created_at}));t.status(200).json({success:!0,category:r,leaderboard:l})}catch(e){console.error("Leaderboard error:",e),t.status(500).json({error:"Failed to fetch leaderboard",details:e.message})}}n=(s.then?(await s)():s)[0],a()}catch(e){a(e)}})},7153:(e,t)=>{var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},1802:(e,t,r)=>{e.exports=r(145)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var r=t(t.s=4010);module.exports=r})();
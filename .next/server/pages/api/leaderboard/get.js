"use strict";(()=>{var e={};e.id=950,e.ids=[950],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},8048:e=>{e.exports=import("@neondatabase/serverless")},6249:(e,r)=>{Object.defineProperty(r,"l",{enumerable:!0,get:function(){return function e(r,t){return t in r?r[t]:"then"in r&&"function"==typeof r.then?r.then(r=>e(r,t)):"function"==typeof r&&"default"===t?r:void 0}}})},4010:(e,r,t)=>{t.a(e,async(e,a)=>{try{t.r(r),t.d(r,{config:()=>u,default:()=>c,routeModule:()=>d});var n=t(1802),s=t(7153),o=t(6249),l=t(7022),i=e([l]);l=(i.then?(await i)():i)[0];let c=(0,o.l)(l,"default"),u=(0,o.l)(l,"config"),d=new n.PagesAPIRouteModule({definition:{kind:s.x.PAGES_API,page:"/api/leaderboard/get",pathname:"/api/leaderboard/get",bundlePath:"",filename:""},userland:l});a()}catch(e){a(e)}})},5015:(e,r,t)=>{t.a(e,async(e,a)=>{try{t.d(r,{M:()=>o,i:()=>i});var n=t(8048),s=e([n]);n=(s.then?(await s)():s)[0];let l=process.env.DATABASE_URL||"postgresql://neondb_owner:npg_h9vSUbw2kNWy@ep-square-cake-aklrmj4p-pooler.c-3.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";if(!l)throw Error("DATABASE_URL is not set");let i=(0,n.neon)(l);async function o(){try{let e=await i`SELECT version()`;return console.log("Database connected successfully:",e[0]),!0}catch(e){return console.error("Database connection failed:",e),!1}}a()}catch(e){a(e)}})},7022:(e,r,t)=>{t.a(e,async(e,a)=>{try{t.r(r),t.d(r,{default:()=>o});var n=t(5015),s=e([n]);async function o(e,r){if("GET"!==e.method)return r.status(405).json({error:"Method not allowed"});try{let{category:t="level",limit:a=10}=e.query;if(!["level","money","experience","missions_completed","total_kills"].includes(t))return r.status(400).json({error:"Invalid category"});let s="",o=[];"money"===t?(s=`
        SELECT p.username, p.money as score, p.level, p.created_at
        FROM players p
        WHERE p.money > 0
        ORDER BY p.money DESC
        LIMIT $1
      `,o=[parseInt(a)]):"level"===t||"experience"===t?(s=`
        SELECT p.username, p.${t} as score, p.money, p.created_at
        FROM players p
        ORDER BY p.${t} DESC
        LIMIT $1
      `,o=[parseInt(a)]):(s=`
        SELECT p.username, gs.stat_value as score, p.level, p.money
        FROM players p
        JOIN game_stats gs ON p.id = gs.player_id
        WHERE gs.stat_name = $1
        ORDER BY gs.stat_value DESC
        LIMIT $2
      `,o=[t,parseInt(a)]);let l=(await n.i.query(s,o)).rows.map((e,r)=>({rank:r+1,username:e.username,score:e.score,level:e.level,money:e.money||0,created_at:e.created_at}));r.status(200).json({success:!0,category:t,leaderboard:l})}catch(e){console.error("Leaderboard error:",e),r.status(500).json({error:"Failed to fetch leaderboard",details:e.message})}}n=(s.then?(await s)():s)[0],a()}catch(e){a(e)}})},7153:(e,r)=>{var t;Object.defineProperty(r,"x",{enumerable:!0,get:function(){return t}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(t||(t={}))},1802:(e,r,t)=>{e.exports=t(145)}};var r=require("../../../webpack-api-runtime.js");r.C(e);var t=r(r.s=4010);module.exports=t})();
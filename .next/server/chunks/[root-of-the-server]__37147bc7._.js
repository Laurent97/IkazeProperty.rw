module.exports=[93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},97770,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),s=e.i(59756),i=e.i(61916),n=e.i(74677),o=e.i(69741),u=e.i(16795),d=e.i(87718),l=e.i(95169),c=e.i(47587),p=e.i(66012),E=e.i(70101),h=e.i(26937),R=e.i(10372),m=e.i(93695);e.i(52474);var T=e.i(5232),C=e.i(89171),y=e.i(24389);let x="https://swshkufpktnacbotddpb.supabase.co",_=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!x||!_)throw Error("Missing Supabase environment variables");let N=(0,y.createClient)(x,_);async function S(e){try{let e=`
      -- Create inquiry_chats table for real-time chat between admin and customers
      CREATE TABLE IF NOT EXISTS inquiry_chats (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          inquiry_id UUID NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
          sender_id UUID NOT NULL REFERENCES auth.users(id),
          sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('admin', 'customer')),
          message TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_inquiry_chats_inquiry_id ON inquiry_chats(inquiry_id);
      CREATE INDEX IF NOT EXISTS idx_inquiry_chats_created_at ON inquiry_chats(created_at);
      CREATE INDEX IF NOT EXISTS idx_inquiry_chats_sender_id ON inquiry_chats(sender_id);

      -- Enable RLS (Row Level Security)
      ALTER TABLE inquiry_chats ENABLE ROW LEVEL SECURITY;

      -- Drop existing policies if they exist
      DROP POLICY IF EXISTS "Admins can read all inquiry messages" ON inquiry_chats;
      DROP POLICY IF EXISTS "Customers can read their inquiry messages" ON inquiry_chats;
      DROP POLICY IF EXISTS "Admins can insert admin messages" ON inquiry_chats;
      DROP POLICY IF EXISTS "Customers can insert customer messages" ON inquiry_chats;

      -- Create RLS policies
      -- 1. Admins can read all messages for any inquiry
      CREATE POLICY "Admins can read all inquiry messages" ON inquiry_chats
          FOR SELECT USING (
              EXISTS (
                  SELECT 1 FROM users 
                  WHERE users.id = auth.uid() 
                  AND users.role = 'admin'
              )
          );

      -- 2. Customers can read messages for their own inquiries
      CREATE POLICY "Customers can read their inquiry messages" ON inquiry_chats
          FOR SELECT USING (
              EXISTS (
                  SELECT 1 FROM inquiries 
                  WHERE inquiries.id = inquiry_chats.inquiry_id 
                  AND inquiries.buyer_id = auth.uid()
              )
          );

      -- 3. Admins can insert messages as admin
      CREATE POLICY "Admins can insert admin messages" ON inquiry_chats
          FOR INSERT WITH CHECK (
              sender_type = 'admin' 
              AND EXISTS (
                  SELECT 1 FROM users 
                  WHERE users.id = auth.uid() 
                  AND users.role = 'admin'
              )
          );

      -- 4. Customers can insert messages as customer for their inquiries
      CREATE POLICY "Customers can insert customer messages" ON inquiry_chats
          FOR INSERT WITH CHECK (
              sender_type = 'customer'
              AND EXISTS (
                  SELECT 1 FROM inquiries 
                  WHERE inquiries.id = inquiry_chats.inquiry_id 
                  AND inquiries.buyer_id = auth.uid()
              )
          );
    `,{error:t}=await N.rpc("exec_sql",{sql:e});if(t){let{error:e}=await N.from("inquiry_chats").select("id").limit(1);if(e&&"PGRST116"===e.code)return console.log("Table does not exist, attempting to create..."),C.NextResponse.json({success:!0,message:"Chat table setup initiated. If issues persist, manual SQL execution may be required.",note:"Please run the SQL from supabase/20260208_create_inquiry_chats_table.sql manually in Supabase dashboard."})}return C.NextResponse.json({success:!0,message:"Chat table created successfully"})}catch(e){return console.error("Error creating chat table:",e),C.NextResponse.json({error:"Failed to create chat table",details:e instanceof Error?e.message:"Unknown error"},{status:500})}}e.s(["POST",()=>S],6999);var O=e.i(6999);let g=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/setup/chat-table/route",pathname:"/api/setup/chat-table",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/setup/chat-table/route.ts",nextConfigOutput:"",userland:O}),{workAsyncStorage:I,workUnitAsyncStorage:A,serverHooks:q}=g;function f(){return(0,a.patchFetch)({workAsyncStorage:I,workUnitAsyncStorage:A})}async function v(e,t,a){g.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let C="/api/setup/chat-table/route";C=C.replace(/\/index$/,"")||"/";let y=await g.prepare(e,t,{srcPage:C,multiZoneDraftMode:!1});if(!y)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:x,params:_,nextConfig:N,parsedUrl:S,isDraftMode:O,prerenderManifest:I,routerServerContext:A,isOnDemandRevalidate:q,revalidateOnlyGenerated:f,resolvedPathname:v,clientReferenceManifest:b,serverActionsManifest:w}=y,L=(0,o.normalizeAppPath)(C),P=!!(I.dynamicRoutes[L]||I.routes[v]),D=async()=>((null==A?void 0:A.render404)?await A.render404(e,t,S,!1):t.end("This page could not be found"),null);if(P&&!O){let e=!!I.routes[v],t=I.dynamicRoutes[L];if(t&&!1===t.fallback&&!e){if(N.experimental.adapterPath)return await D();throw new m.NoFallbackError}}let U=null;!P||g.isDev||O||(U="/index"===(U=v)?"/":U);let F=!0===g.isDev||!P,H=P&&!F;w&&b&&(0,n.setManifestsSingleton)({page:C,clientReferenceManifest:b,serverActionsManifest:w});let k=e.method||"GET",M=(0,i.getTracer)(),j=M.getActiveScopeSpan(),X={params:_,prerenderManifest:I,renderOpts:{experimental:{authInterrupts:!!N.experimental.authInterrupts},cacheComponents:!!N.cacheComponents,supportsDynamicResponse:F,incrementalCache:(0,s.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:N.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,s)=>g.onRequestError(e,t,a,s,A)},sharedContext:{buildId:x}},K=new u.NodeNextRequest(e),W=new u.NodeNextResponse(t),Y=d.NextRequestAdapter.fromNodeNextRequest(K,(0,d.signalFromNodeResponse)(t));try{let n=async e=>g.handle(Y,X).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=M.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==l.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${k} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${k} ${C}`)}),o=!!(0,s.getRequestMeta)(e,"minimalMode"),u=async s=>{var i,u;let d=async({previousCacheEntry:r})=>{try{if(!o&&q&&f&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await n(s);e.fetchMetrics=X.renderOpts.fetchMetrics;let u=X.renderOpts.pendingWaitUntil;u&&a.waitUntil&&(a.waitUntil(u),u=void 0);let d=X.renderOpts.collectedTags;if(!P)return await (0,p.sendResponse)(K,W,i,X.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,E.toNodeOutgoingHttpHeaders)(i.headers);d&&(t[R.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==X.renderOpts.collectedRevalidate&&!(X.renderOpts.collectedRevalidate>=R.INFINITE_CACHE)&&X.renderOpts.collectedRevalidate,a=void 0===X.renderOpts.collectedExpire||X.renderOpts.collectedExpire>=R.INFINITE_CACHE?void 0:X.renderOpts.collectedExpire;return{value:{kind:T.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await g.onRequestError(e,t,{routerKind:"App Router",routePath:C,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:q})},!1,A),t}},l=await g.handleResponse({req:e,nextConfig:N,cacheKey:U,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:I,isRoutePPREnabled:!1,isOnDemandRevalidate:q,revalidateOnlyGenerated:f,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:o});if(!P)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==T.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(u=l.value)?void 0:u.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});o||t.setHeader("x-nextjs-cache",q?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),O&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,E.fromNodeOutgoingHttpHeaders)(l.value.headers);return o&&P||m.delete(R.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,h.getCacheControlHeader)(l.cacheControl)),await (0,p.sendResponse)(K,W,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};j?await u(j):await M.withPropagatedContext(e.headers,()=>M.trace(l.BaseServerSpan.handleRequest,{spanName:`${k} ${C}`,kind:i.SpanKind.SERVER,attributes:{"http.method":k,"http.target":e.url}},u))}catch(t){if(t instanceof m.NoFallbackError||await g.onRequestError(e,t,{routerKind:"App Router",routePath:L,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:q})},!1,A),P)throw t;return await (0,p.sendResponse)(K,W,new Response(null,{status:500})),null}}e.s(["handler",()=>v,"patchFetch",()=>f,"routeModule",()=>g,"serverHooks",()=>q,"workAsyncStorage",()=>I,"workUnitAsyncStorage",()=>A],97770)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__37147bc7._.js.map
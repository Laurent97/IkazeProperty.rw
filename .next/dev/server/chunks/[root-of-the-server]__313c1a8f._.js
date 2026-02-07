module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/supabase-client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "fetchListingsWithDetails",
    ()=>fetchListingsWithDetails,
    "supabaseClient",
    ()=>supabaseClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://swshkufpktnacbotddpb.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3c2hrdWZwa3RuYWNib3RkZHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NTE4MzksImV4cCI6MjA4NjAyNzgzOX0.XjlJZscCno-_czhwXqwdSlKgUUpDZty6i37mtwqcnA8");
const supabaseClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    },
    global: {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
});
const __TURBOPACK__default__export__ = supabaseClient;
async function fetchListingsWithDetails(filters) {
    try {
        const { category = 'other', searchQuery = '', priceRange = {}, subcategory = '', condition = '', sortBy = 'created_at', limit = 50 } = filters;
        let query = supabaseClient.from('listings').select(`
        *,
        seller:users!listings_seller_id_fkey(
          id,
          full_name,
          email,
          avatar_url
        )
      `).eq('status', 'available').eq('category', category);
        // Apply text search
        if (searchQuery.trim()) {
            query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }
        // Apply price range
        if (priceRange.min) {
            const min = parseInt(priceRange.min) || 0;
            query = query.gte('price', min);
        }
        if (priceRange.max) {
            const max = parseInt(priceRange.max) || 1000000000;
            query = query.lte('price', max);
        }
        // Apply sorting
        switch(sortBy){
            case 'price':
                query = query.order('price', {
                    ascending: true
                });
                break;
            case 'price_desc':
                query = query.order('price', {
                    ascending: false
                });
                break;
            case 'views':
                query = query.order('views', {
                    ascending: false
                });
                break;
            case 'likes':
                query = query.order('likes', {
                    ascending: false
                });
                break;
            default:
                query = query.order('created_at', {
                    ascending: false
                });
        }
        query = query.limit(limit);
        const { data: listings, error: listingsError } = await query;
        if (listingsError) {
            console.error('Error fetching listings:', listingsError);
            return {
                listings: [],
                error: listingsError
            };
        }
        if (!listings || listings.length === 0) {
            return {
                listings: []
            };
        }
        // Fetch additional data in parallel
        const listingIds = listings.map((l)=>l.id);
        const [mediaResult, detailsResult] = await Promise.all([
            supabaseClient.from('listing_media').select('*').in('listing_id', listingIds).order('order_index', {
                ascending: true
            }),
            supabaseClient.from('other_item_details').select('*').in('listing_id', listingIds)
        ]);
        // Process the data
        const listingsWithDetails = listings.map((listing)=>{
            const listingMedia = mediaResult.data?.filter((m)=>m.listing_id === listing.id) || [];
            const listingDetails = detailsResult.data?.find((d)=>d.listing_id === listing.id);
            return {
                ...listing,
                media: listingMedia.map((media)=>({
                        url: media.url,
                        public_id: media.public_id,
                        media_type: media.media_type,
                        is_primary: media.is_primary,
                        order_index: media.order_index
                    })),
                other_details: listingDetails ? {
                    subcategory: listingDetails.subcategory,
                    brand: listingDetails.brand,
                    model: listingDetails.model,
                    condition: listingDetails.condition,
                    warranty_available: listingDetails.warranty_available,
                    warranty_period: listingDetails.warranty_period,
                    reason_for_selling: listingDetails.reason_for_selling,
                    original_purchase_date: listingDetails.original_purchase_date,
                    age_of_item: listingDetails.age_of_item
                } : undefined
            };
        });
        // Apply additional filters after fetching
        let filteredListings = listingsWithDetails;
        if (subcategory) {
            filteredListings = filteredListings.filter((l)=>l.other_details?.subcategory === subcategory);
        }
        if (condition) {
            filteredListings = filteredListings.filter((l)=>l.other_details?.condition === condition);
        }
        return {
            listings: filteredListings
        };
    } catch (error) {
        console.error('Error in fetchListingsWithDetails:', error);
        return {
            listings: [],
            error
        };
    }
}
}),
"[project]/src/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCurrentUser",
    ()=>getCurrentUser,
    "getUserProfile",
    ()=>getUserProfile,
    "resetPassword",
    ()=>resetPassword,
    "signIn",
    ()=>signIn,
    "signOut",
    ()=>signOut,
    "signUp",
    ()=>signUp,
    "supabase",
    ()=>supabase,
    "supabaseAdmin",
    ()=>supabaseAdmin,
    "updatePassword",
    ()=>updatePassword,
    "updateUserProfile",
    ()=>updateUserProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase-client.ts [app-route] (ecmascript)");
;
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://swshkufpktnacbotddpb.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3c2hrdWZwa3RuYWNib3RkZHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NTE4MzksImV4cCI6MjA4NjAyNzgzOX0.XjlJZscCno-_czhwXqwdSlKgUUpDZty6i37mtwqcnA8");
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabase = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseClient"];
const supabaseAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
const signUp = async (email, password, fullName)=>{
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName
            }
        }
    });
    if (error) throw error;
    // Create user profile
    if (data.user) {
        const { error: profileError } = await supabase.from('users').insert({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            role: 'user'
        });
        if (profileError) throw profileError;
    }
    return data;
};
const signIn = async (email, password)=>{
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) throw error;
    return data;
};
const signOut = async ()=>{
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};
const getCurrentUser = async ()=>{
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
};
const getUserProfile = async (userId)=>{
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
    if (error && error.code !== 'PGRST116') {
        throw error;
    }
    return data;
};
const updateUserProfile = async (userId, updates)=>{
    const { data, error } = await supabase.from('users').update(updates).eq('id', userId).select().single();
    if (error) throw error;
    return data;
};
const resetPassword = async (email)=>{
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
};
const updatePassword = async (password)=>{
    const { error } = await supabase.auth.updateUser({
        password
    });
    if (error) throw error;
};
}),
"[project]/src/app/api/test-auth/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        // Test environment variables
        const envVars = {
            supabaseUrl: ("TURBOPACK compile-time truthy", 1) ? 'Loaded' : "TURBOPACK unreachable",
            supabaseAnonKey: ("TURBOPACK compile-time truthy", 1) ? 'Loaded' : "TURBOPACK unreachable",
            serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Loaded' : 'Missing'
        };
        // Test Supabase connection
        let supabaseTest = 'Not tested';
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('users').select('count').limit(1);
            supabaseTest = error ? `Error: ${error.message}` : 'Connected successfully';
        } catch (error) {
            supabaseTest = `Connection error: ${error.message}`;
        }
        // Test auth session
        let authTest = 'Not tested';
        try {
            const { data: { session }, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            authTest = error ? `Error: ${error.message}` : session ? `Session found for ${session.user?.email}` : 'No session';
        } catch (error) {
            authTest = `Auth error: ${error.message}`;
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            environment: envVars,
            supabase: supabaseTest,
            auth: authTest,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message,
            timestamp: new Date().toISOString()
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__313c1a8f._.js.map
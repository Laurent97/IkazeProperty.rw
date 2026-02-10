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
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
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
    "changeUserEmail",
    ()=>changeUserEmail,
    "getCurrentUser",
    ()=>getCurrentUser,
    "getSupabaseAdmin",
    ()=>getSupabaseAdmin,
    "getSupabaseAuth",
    ()=>getSupabaseAuth,
    "getUserProfile",
    ()=>getUserProfile,
    "resetPassword",
    ()=>resetPassword,
    "signIn",
    ()=>signIn,
    "signInWithGoogle",
    ()=>signInWithGoogle,
    "signInWithMagicLink",
    ()=>signInWithMagicLink,
    "signOut",
    ()=>signOut,
    "signUp",
    ()=>signUp,
    "supabase",
    ()=>supabase,
    "supabaseAdmin",
    ()=>supabaseAdmin,
    "supabaseAuth",
    ()=>supabaseAuth,
    "updatePassword",
    ()=>updatePassword,
    "updateUserProfile",
    ()=>updateUserProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase-client.ts [app-route] (ecmascript)");
;
;
let _supabaseAdmin = null;
let _supabaseAuth = null;
const getSupabaseAdmin = ()=>{
    if (!_supabaseAdmin) {
        const supabaseUrl = ("TURBOPACK compile-time value", "https://swshkufpktnacbotddpb.supabase.co");
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
        }
        _supabaseAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceKey);
    }
    return _supabaseAdmin;
};
const getSupabaseAuth = ()=>{
    if (!_supabaseAuth) {
        const supabaseUrl = ("TURBOPACK compile-time value", "https://swshkufpktnacbotddpb.supabase.co");
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
        }
        _supabaseAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceKey);
    }
    return _supabaseAuth;
};
const supabase = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabaseClient"];
const supabaseAdmin = getSupabaseAdmin;
const supabaseAuth = getSupabaseAuth;
const signUp = async (email, password, fullName)=>{
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password,
            fullName
        })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
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
    const authClient = supabaseAuth();
    const { data, error } = await authClient.from('users').update(updates).eq('id', userId).select().single();
    if (error) throw error;
    return data;
};
const resetPassword = async (email)=>{
    // Use admin client to bypass rate limiting for security purposes
    const adminClient = getSupabaseAdmin();
    const { error } = await adminClient.auth.admin.generateLink({
        type: 'recovery',
        email,
        options: {
            redirectTo: `${window.location.origin}/auth/reset-password`
        }
    });
    if (error) throw error;
};
const updatePassword = async (password)=>{
    const { error } = await supabase.auth.updateUser({
        password
    });
    if (error) throw error;
};
const signInWithGoogle = async ()=>{
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`
        }
    });
    if (error) throw error;
    return data;
};
const signInWithMagicLink = async (email)=>{
    const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
        }
    });
    if (error) throw error;
    return data;
};
const changeUserEmail = async (newEmail)=>{
    const { data, error } = await supabase.auth.updateUser({
        email: newEmail
    });
    if (error) throw error;
    return data;
};
}),
"[project]/src/app/api/track-view/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    try {
        const { listingId } = await request.json();
        if (!listingId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Listing ID is required'
            }, {
                status: 400
            });
        }
        // Get current user (optional, handle gracefully)
        let currentUser = null;
        try {
            currentUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        } catch (error) {
            // User is not authenticated, that's fine for tracking views
            console.log('User not authenticated, tracking anonymous view');
        }
        // Get client info
        const userAgent = request.headers.get('user-agent') || null;
        const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null;
        // Generate a session ID for anonymous users
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        // Use admin client to avoid RLS issues
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSupabaseAdmin"])();
        // Direct insert into listing_views table
        const { error } = await supabase.from('listing_views').insert({
            listing_id: listingId,
            user_id: currentUser?.id || null,
            ip_address: ipAddress || null,
            user_agent: userAgent,
            session_id: currentUser ? null : sessionId
        });
        if (error) {
            console.error('Error inserting view:', error);
            // Don't return 500 for view tracking failures, just log them
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                warning: 'View tracking failed but request succeeded'
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    } catch (error) {
        console.error('Error in track-view API:', error);
        // Don't fail the entire request for view tracking issues
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            warning: 'View tracking encountered an error but request succeeded'
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d95e7f39._.js.map
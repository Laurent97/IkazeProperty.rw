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
"[project]/src/app/api/inquiries/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
;
// Create supabase client for database operations
const supabaseUrl = ("TURBOPACK compile-time value", "https://swshkufpktnacbotddpb.supabase.co");
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
}
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceKey);
async function getCurrentUser(request) {
    const userSupabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceKey);
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return null;
    const token = authHeader.replace('Bearer ', '');
    // Validate the JWT token using getUser with service role key
    const { data: { user }, error } = await userSupabase.auth.getUser(token);
    if (error || !user) {
        console.error('Auth validation error:', error?.message);
        return null;
    }
    return user;
}
async function POST(request) {
    try {
        const currentUser = await getCurrentUser(request);
        if (!currentUser) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Authentication required. Please log in and try again.'
            }, {
                status: 401
            });
        }
        const { listing_id, message } = await request.json();
        if (!listing_id || !message) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Listing ID and message are required'
            }, {
                status: 400
            });
        }
        // Get listing details
        const { data: listing, error: listingError } = await supabase.from('listings').select('seller_id, title').eq('id', listing_id).single();
        if (listingError || !listing) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Listing not found'
            }, {
                status: 404
            });
        }
        // Check if user is not the seller
        if (listing.seller_id === currentUser.id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Cannot inquire about your own listing'
            }, {
                status: 400
            });
        }
        // Check if inquiry already exists
        const { data: existingInquiry } = await supabase.from('inquiries').select('id').eq('listing_id', listing_id).eq('buyer_id', currentUser.id).eq('status', 'pending').single();
        if (existingInquiry) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'You already have a pending inquiry for this listing'
            }, {
                status: 400
            });
        }
        // Create inquiry
        const { data: inquiry, error: inquiryError } = await supabase.from('inquiries').insert({
            listing_id,
            buyer_id: currentUser.id,
            seller_id: listing.seller_id,
            message,
            status: 'pending'
        }).select().single();
        if (inquiryError) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to create inquiry'
            }, {
                status: 500
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: inquiry
        });
    } catch (error) {
        console.error('Inquiry creation error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
async function GET(request) {
    try {
        const currentUser = await getCurrentUser(request);
        if (!currentUser) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Authentication required'
            }, {
                status: 401
            });
        }
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const role = searchParams.get('role') // 'buyer' or 'seller'
        ;
        let query = supabase.from('inquiries').select('*').order('created_at', {
            ascending: false
        });
        // Filter by user role
        if (role === 'buyer') {
            query = query.eq('buyer_id', currentUser.id);
        } else if (role === 'seller') {
            query = query.eq('seller_id', currentUser.id);
        } else {
            // Admin can see all inquiries
            const { data: userProfile } = await supabase.from('users').select('role').eq('id', currentUser.id).single();
            if (userProfile?.role !== 'admin') {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'Insufficient permissions'
                }, {
                    status: 403
                });
            }
        }
        // Filter by status
        if (status) {
            query = query.eq('status', status);
        }
        const { data: inquiries, error } = await query;
        if (error) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to fetch inquiries'
            }, {
                status: 500
            });
        }
        // Fetch listing data for each inquiry
        const inquiriesWithListings = await Promise.all((inquiries || []).map(async (inquiry)=>{
            console.log('🔍 Processing inquiry:', {
                inquiryId: inquiry.id,
                listingId: inquiry.listing_id,
                listingIdType: typeof inquiry.listing_id
            });
            if (inquiry.listing_id) {
                const { data: listing, error: listingError } = await supabase.from('listings').select('id, title, category, price').eq('id', inquiry.listing_id).single();
                console.log('📋 Listing fetch result:', {
                    listingId: inquiry.listing_id,
                    listing,
                    error: listingError
                });
                return {
                    ...inquiry,
                    listings: listing
                };
            }
            console.log('⚠️ No listing_id for inquiry:', inquiry.id);
            return {
                ...inquiry,
                listings: null
            };
        }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: inquiriesWithListings
        });
    } catch (error) {
        console.error('Inquiry fetch error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        const currentUser = await getCurrentUser(request);
        if (!currentUser) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Authentication required. Please log in and try again.'
            }, {
                status: 401
            });
        }
        // Check if user is admin
        const { data: userProfile } = await supabase.from('users').select('role').eq('id', currentUser.id).single();
        if (userProfile?.role !== 'admin') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Insufficient permissions. Admin access required.'
            }, {
                status: 403
            });
        }
        const { inquiry_id, status, admin_notes } = await request.json();
        console.log('PUT request data:', {
            inquiry_id,
            status,
            admin_notes
        });
        if (!inquiry_id || !status) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Inquiry ID and status are required'
            }, {
                status: 400
            });
        }
        // Update inquiry
        const { data: inquiry, error } = await supabase.from('inquiries').update({
            status,
            admin_notes
        }).eq('id', inquiry_id).select().single();
        console.log('Database update result:', {
            inquiry,
            error
        });
        if (error) {
            console.error('Database update error:', error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `Failed to update inquiry: ${error.message}`
            }, {
                status: 500
            });
        }
        // If approved, create a transaction record
        if (status === 'approved') {
            const { data: listing } = await supabase.from('listings').select('price, commission_rate').eq('id', inquiry.listing_id).single();
            if (listing) {
                const commission_amount = Math.round(listing.price * listing.commission_rate);
                await supabase.from('transactions').insert({
                    listing_id: inquiry.listing_id,
                    buyer_id: inquiry.buyer_id,
                    seller_id: inquiry.seller_id,
                    amount: listing.price,
                    commission_amount,
                    commission_rate: listing.commission_rate,
                    status: 'pending'
                });
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: inquiry
        });
    } catch (error) {
        console.error('Inquiry update error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d28b72c4._.js.map
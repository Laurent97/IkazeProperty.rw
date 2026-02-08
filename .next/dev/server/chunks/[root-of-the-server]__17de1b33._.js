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
"[project]/src/app/api/fix-rls/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
async function POST(request) {
    try {
        // Import supabase admin client
        const { getSupabaseAdmin } = await __turbopack_context__.A("[project]/src/lib/auth.ts [app-route] (ecmascript, async loader)");
        const supabase = getSupabaseAdmin();
        // Simple fix: Disable problematic policies temporarily
        const fixes = [
            // Drop recursive policies
            'DROP POLICY IF EXISTS "Admins can manage all users" ON users;',
            'DROP POLICY IF EXISTS "Admins can manage all listings" ON listings;',
            'DROP POLICY IF EXISTS "Admins can manage settings" ON settings;',
            'DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;',
            // Create simple admin policies without recursion
            `CREATE POLICY "Admins can manage all users" ON users
        FOR ALL USING (auth.role() = 'service_role' OR (auth.role() = 'authenticated' AND auth.uid() IN ('admin-user-id-placeholder')));`,
            `CREATE POLICY "Admins can manage all listings" ON listings
        FOR ALL USING (auth.role() = 'service_role' OR (auth.role() = 'authenticated' AND auth.uid() IN ('admin-user-id-placeholder')));`,
            `CREATE POLICY "Admins can manage settings" ON settings
        FOR ALL USING (auth.role() = 'service_role' OR (auth.role() = 'authenticated' AND auth.uid() IN ('admin-user-id-placeholder')));`,
            `CREATE POLICY "Admins can manage site settings" ON site_settings
        FOR ALL USING (auth.role() = 'service_role' OR (auth.role() = 'authenticated' AND auth.uid() IN ('admin-user-id-placeholder')));`,
            // Add default site settings
            `INSERT INTO site_settings (admin_phone, whatsapp_phone, support_email, office_address) 
       VALUES ('+250737060025', '+250737060025', 'support@ikazeproperty.rw', 'Kigali, Rwanda')
       ON CONFLICT DO NOTHING;`
        ];
        for (const sql of fixes){
            // Use raw SQL execution through PostgREST
            const { error } = await supabase.rpc('exec_sql', {
                query: sql
            });
            if (error && !error.message.includes('does not exist')) {
                console.error('SQL Error:', error, 'for:', sql);
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: 'RLS recursion fix applied'
        });
    } catch (err) {
        console.error('Error:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__17de1b33._.js.map
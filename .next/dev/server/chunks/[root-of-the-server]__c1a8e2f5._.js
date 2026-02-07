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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[project]/src/lib/cloudinary.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteImage",
    ()=>deleteImage,
    "generateUploadSignature",
    ()=>generateUploadSignature,
    "getListingImages",
    ()=>getListingImages,
    "getOptimizedImageUrl",
    ()=>getOptimizedImageUrl,
    "getThumbnailUrl",
    ()=>getThumbnailUrl,
    "uploadBuffer",
    ()=>uploadBuffer,
    "uploadImage",
    ()=>uploadImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cloudinary/cloudinary.js [app-route] (ecmascript)");
;
// Configure Cloudinary
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].config({
    cloud_name: ("TURBOPACK compile-time value", "dp7yzc36n"),
    api_key: ("TURBOPACK compile-time value", "881578353214939"),
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});
const uploadImage = async (file, options = {})=>{
    try {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].uploader.upload(file, {
            folder: options.folder || 'ikazeproperty',
            resource_type: options.resource_type || 'auto',
            transformation: options.transformation,
            overwrite: false,
            use_filename: true,
            unique_filename: false,
            filename_as_display_name: true
        });
        return {
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            size: result.bytes
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image');
    }
};
const uploadBuffer = async (buffer, filename, options = {})=>{
    try {
        return new Promise((resolve, reject)=>{
            const uploadStream = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].uploader.upload_stream({
                folder: options.folder || 'ikazeproperty',
                resource_type: options.resource_type || 'auto',
                transformation: options.transformation,
                overwrite: false,
                use_filename: true,
                unique_filename: false,
                filename_as_display_name: true,
                public_id: filename
            }, (error, result)=>{
                if (error) {
                    reject(error);
                } else if (result) {
                    resolve({
                        url: result.secure_url,
                        public_id: result.public_id,
                        width: result.width,
                        height: result.height,
                        format: result.format,
                        size: result.bytes
                    });
                } else {
                    reject(new Error('Upload failed: No result returned'));
                }
            });
            uploadStream.end(buffer);
        });
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image');
    }
};
const deleteImage = async (public_id)=>{
    try {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].uploader.destroy(public_id);
        return result;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw new Error('Failed to delete image');
    }
};
const generateUploadSignature = (options = {})=>{
    const timestamp = options.timestamp || Math.floor(Date.now() / 1000);
    const params = {
        timestamp,
        folder: options.folder || 'ikazeproperty',
        overwrite: false,
        use_filename: true,
        unique_filename: false,
        filename_as_display_name: true
    };
    if (options.public_id) {
        params.public_id = options.public_id;
    }
    const signature = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);
    return {
        signature,
        timestamp,
        cloud_name: ("TURBOPACK compile-time value", "dp7yzc36n"),
        api_key: ("TURBOPACK compile-time value", "881578353214939"),
        folder: params.folder,
        overwrite: params.overwrite,
        use_filename: params.use_filename,
        unique_filename: params.unique_filename,
        filename_as_display_name: params.filename_as_display_name
    };
};
const getOptimizedImageUrl = (public_id, options = {})=>{
    const transformation = {
        width: options.width,
        height: options.height,
        crop: options.crop || 'fill',
        quality: options.quality || 'auto',
        format: options.format || 'auto',
        ...options
    };
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].url(public_id, {
        transformation,
        secure: true
    });
};
const getThumbnailUrl = (public_id, size = 200)=>{
    return getOptimizedImageUrl(public_id, {
        width: size,
        height: size,
        crop: 'thumb',
        quality: 80
    });
};
const getListingImages = (public_id)=>{
    return {
        thumbnail: getThumbnailUrl(public_id, 150),
        small: getOptimizedImageUrl(public_id, {
            width: 300,
            height: 200,
            crop: 'fill'
        }),
        medium: getOptimizedImageUrl(public_id, {
            width: 600,
            height: 400,
            crop: 'fill'
        }),
        large: getOptimizedImageUrl(public_id, {
            width: 1200,
            height: 800,
            crop: 'fill'
        }),
        original: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"].url(public_id, {
            secure: true
        })
    };
};
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cloudinary$2f$cloudinary$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["v2"];
}),
"[project]/src/app/api/upload/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cloudinary$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cloudinary.ts [app-route] (ecmascript)");
;
;
async function POST(request) {
    try {
        console.log('🚀 Upload API called');
        // Check environment variables
        console.log('🔑 Environment variables check:', {
            cloudName: !!("TURBOPACK compile-time value", "dp7yzc36n"),
            apiKey: !!("TURBOPACK compile-time value", "881578353214939"),
            apiSecret: !!process.env.CLOUDINARY_API_SECRET
        });
        const formData = await request.formData();
        const file = formData.get('file');
        const folder = formData.get('folder') || 'ikazeproperty';
        const resourceType = formData.get('resourceType') || 'auto';
        console.log('📁 File details:', {
            fileName: file?.name,
            fileSize: file?.size,
            fileType: file?.type,
            folder,
            resourceType
        });
        if (!file) {
            console.error('❌ No file provided');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'No file provided'
            }, {
                status: 400
            });
        }
        // Validate file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        // Check file size (limit to 100MB)
        const maxSize = 100 * 1024 * 1024 // 100MB in bytes
        ;
        if (buffer.length > maxSize) {
            console.error('❌ File too large:', buffer.length, 'bytes');
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'File size too large. Maximum size is 100MB.'
            }, {
                status: 400
            });
        }
        // Determine resource type based on file
        const fileType = file.type.startsWith('video/') ? 'video' : 'image';
        const detectedResourceType = formData.get('resourceType') || 'auto';
        const finalResourceType = detectedResourceType === 'auto' ? fileType : detectedResourceType;
        console.log('📤 Starting Cloudinary upload...');
        // Upload to Cloudinary with appropriate settings
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cloudinary$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uploadBuffer"])(buffer, file.name, {
            folder,
            resource_type: finalResourceType,
            // Video-specific settings
            ...fileType.startsWith('video/') && {
                chunk_size: '600k',
                eager: 'streaming' // For video optimization
            }
        });
        console.log('✅ Cloudinary upload successful:', {
            url: result.secure_url || result.url,
            public_id: result.public_id,
            width: result.width,
            height: result.height
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                url: result.secure_url || result.url,
                public_id: result.public_id,
                size: file.size,
                type: fileType,
                duration: result.duration || null,
                format: result.format || null // Video format if available
            }
        });
    } catch (error) {
        console.error('❌ Upload error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error.message || 'Failed to upload file'
        }, {
            status: 500
        });
    }
}
async function DELETE(request) {
    try {
        const { public_id } = await request.json();
        if (!public_id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'No public_id provided'
            }, {
                status: 400
            });
        }
        const { deleteImage } = await __turbopack_context__.A("[project]/src/lib/cloudinary.ts [app-route] (ecmascript, async loader)");
        const result = await deleteImage(public_id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Delete error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to delete file'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c1a8e2f5._.js.map
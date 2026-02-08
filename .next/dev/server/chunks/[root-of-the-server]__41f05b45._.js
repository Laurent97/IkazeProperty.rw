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
"[project]/src/lib/supabase.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase,
    "supabaseAdmin",
    ()=>supabaseAdmin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://swshkufpktnacbotddpb.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3c2hrdWZwa3RuYWNib3RkZHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NTE4MzksImV4cCI6MjA4NjAyNzgzOX0.XjlJZscCno-_czhwXqwdSlKgUUpDZty6i37mtwqcnA8");
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = supabaseServiceRoleKey ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceRoleKey) : supabase;
}),
"[project]/src/lib/notifications/service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotificationService",
    ()=>NotificationService,
    "NotificationTemplates",
    ()=>NotificationTemplates
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-route] (ecmascript)");
;
class NotificationService {
    // Create notification record
    static async createNotification(data) {
        try {
            const { data: notification, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('notifications').insert({
                user_id: data.user_id,
                type: data.type,
                title: data.title,
                message: data.message,
                data: data.data,
                channels: data.channels,
                priority: data.priority,
                status: 'pending',
                created_at: new Date().toISOString()
            }).select().single();
            if (error) {
                console.error('Error creating notification:', error);
                return null;
            }
            // Process notification channels
            await this.processNotificationChannels(notification);
            return notification;
        } catch (error) {
            console.error('Error in createNotification:', error);
            return null;
        }
    }
    // Process notification through different channels
    static async processNotificationChannels(notification) {
        const { channels, user_id } = notification;
        // Get user preferences and contact info
        const { data: user } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('users').select('email, phone, notification_preferences').eq('id', user_id).single();
        if (!user) return;
        const preferences = user.notification_preferences || {};
        for (const channel of channels){
            try {
                switch(channel){
                    case 'email':
                        if (preferences.email !== false && user.email) {
                            await this.sendEmail(user.email, notification);
                        }
                        break;
                    case 'sms':
                        if (preferences.sms !== false && user.phone) {
                            await this.sendSMS(user.phone, notification);
                        }
                        break;
                    case 'push':
                        if (preferences.push !== false) {
                            await this.sendPushNotification(user_id, notification);
                        }
                        break;
                    case 'in_app':
                        // In-app notifications are stored in the database
                        await this.markInAppNotificationRead(notification.id);
                        break;
                }
            } catch (error) {
                console.error(`Error sending ${channel} notification:`, error);
            }
        }
        // Mark notification as processed
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('notifications').update({
            status: 'sent',
            sent_at: new Date().toISOString()
        }).eq('id', notification.id);
    }
    // Send email notification
    static async sendEmail(email, notification) {
        try {
            // In production, integrate with email service like SendGrid, AWS SES, etc.
            console.log(`Sending email to ${email}:`, {
                subject: notification.title,
                body: notification.message
            });
            // Mock email sending - replace with actual email service
            const emailData = {
                to: email,
                subject: notification.title,
                html: this.generateEmailTemplate(notification),
                text: notification.message
            };
            // Example with SendGrid (would require @sendgrid/mail package)
            // const sgMail = require('@sendgrid/mail');
            // await sgMail.send(emailData);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }
    // Send SMS notification
    static async sendSMS(phone, notification) {
        try {
            // In production, integrate with SMS service like Twilio, Africa's Talking, etc.
            console.log(`Sending SMS to ${phone}:`, notification.message);
            // Mock SMS sending - replace with actual SMS service
            const smsData = {
                to: phone,
                message: notification.message,
                from: 'IkazeProperty'
            };
            // Example with Twilio (would require twilio package)
            // const twilio = require('twilio');
            // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            // await client.messages.create(smsData);
            return true;
        } catch (error) {
            console.error('Error sending SMS:', error);
            return false;
        }
    }
    // Send push notification
    static async sendPushNotification(userId, notification) {
        try {
            // In production, integrate with push notification service like Firebase Cloud Messaging
            console.log(`Sending push notification to user ${userId}:`, {
                title: notification.title,
                body: notification.message
            });
            // Mock push notification - replace with actual push service
            const pushData = {
                userId,
                title: notification.title,
                body: notification.message,
                data: notification.data,
                icon: '/icon-192x192.png'
            };
            // Example with Firebase (would require firebase-admin package)
            // const admin = require('firebase-admin');
            // await admin.messaging().sendToDevice(pushData);
            return true;
        } catch (error) {
            console.error('Error sending push notification:', error);
            return false;
        }
    }
    // Mark in-app notification as read
    static async markInAppNotificationRead(notificationId) {
        // In-app notifications are automatically available in the database
        // This method could be used to update read status when user views it
        return true;
    }
    // Generate email template
    static generateEmailTemplate(notification) {
        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>IkazeProperty - ${notification.title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #000; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .btn { display: inline-block; padding: 12px 24px; background: #E53935; color: white; text-decoration: none; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>IkazeProperty</h1>
          </div>
          <div class="content">
            <h2>${notification.title}</h2>
            <p>${notification.message}</p>
            ${notification.data?.actionUrl ? `<a href="${notification.data.actionUrl}" class="btn">View Details</a>` : ''}
          </div>
          <div class="footer">
            <p>&copy; 2026 IkazeProperty. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    }
    // Get user notifications
    static async getUserNotifications(userId, limit = 20, offset = 0) {
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('notifications').select('*').eq('user_id', userId).order('created_at', {
                ascending: false
            }).range(offset, offset + limit - 1);
            if (error) {
                console.error('Error fetching notifications:', error);
                return [];
            }
            return data || [];
        } catch (error) {
            console.error('Error in getUserNotifications:', error);
            return [];
        }
    }
    // Mark notification as read
    static async markAsRead(notificationId, userId) {
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('notifications').update({
                read_at: new Date().toISOString()
            }).eq('id', notificationId).eq('user_id', userId);
            return !error;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            return false;
        }
    }
    // Mark all notifications as read for user
    static async markAllAsRead(userId) {
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('notifications').update({
                read_at: new Date().toISOString()
            }).eq('user_id', userId).is('read_at', null);
            return !error;
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            return false;
        }
    }
    // Delete notification
    static async deleteNotification(notificationId, userId) {
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('notifications').delete().eq('id', notificationId).eq('user_id', userId);
            return !error;
        } catch (error) {
            console.error('Error deleting notification:', error);
            return false;
        }
    }
}
const NotificationTemplates = {
    paymentCompleted: (amount, method)=>({
            title: 'Payment Completed',
            message: `Your payment of ${amount} RWF via ${method} has been completed successfully.`,
            channels: [
                'email',
                'in_app'
            ],
            priority: 'high'
        }),
    paymentFailed: (amount, method, reason)=>({
            title: 'Payment Failed',
            message: `Your payment of ${amount} RWF via ${method} failed. Reason: ${reason}`,
            channels: [
                'email',
                'in_app'
            ],
            priority: 'high'
        }),
    promotionActivated: (listingTitle, packageName)=>({
            title: 'Promotion Activated',
            message: `Your promotion "${packageName}" for listing "${listingTitle}" has been activated.`,
            channels: [
                'email',
                'in_app'
            ],
            priority: 'medium'
        }),
    promotionExpiring: (listingTitle, daysLeft)=>({
            title: 'Promotion Expiring Soon',
            message: `Your promotion for listing "${listingTitle}" will expire in ${daysLeft} days.`,
            channels: [
                'email',
                'in_app'
            ],
            priority: 'medium'
        }),
    inquiryReceived: (listingTitle, buyerName)=>({
            title: 'New Inquiry Received',
            message: `You have received a new inquiry for your listing "${listingTitle}" from ${buyerName}.`,
            channels: [
                'email',
                'sms',
                'in_app'
            ],
            priority: 'high'
        }),
    inquiryApproved: (listingTitle)=>({
            title: 'Inquiry Approved',
            message: `Your inquiry for "${listingTitle}" has been approved. You can now contact the seller.`,
            channels: [
                'email',
                'in_app'
            ],
            priority: 'high'
        }),
    walletTopup: (amount, method)=>({
            title: 'Wallet Top-up Successful',
            message: `Your wallet has been credited with ${amount} RWF via ${method}.`,
            channels: [
                'email',
                'in_app'
            ],
            priority: 'medium'
        }),
    refundProcessed: (amount, reason)=>({
            title: 'Refund Processed',
            message: `A refund of ${amount} RWF has been processed. Reason: ${reason}`,
            channels: [
                'email',
                'in_app'
            ],
            priority: 'high'
        })
};
}),
"[project]/src/app/api/notifications/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notifications$2f$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/notifications/service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    try {
        // Get auth token from request headers
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');
        if (!token) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'No authorization token'
            }, {
                status: 401
            });
        }
        // Verify user using the token
        const { data: { user }, error: authError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].auth.getUser(token);
        if (authError || !user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid token'
            }, {
                status: 401
            });
        }
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = parseInt(searchParams.get('offset') || '0');
        const notifications = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notifications$2f$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NotificationService"].getUserNotifications(user.id, limit, offset);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            notifications
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        // Get auth token from request headers
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');
        if (!token) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'No authorization token'
            }, {
                status: 401
            });
        }
        // Verify user using the token
        const { data: { user }, error: authError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].auth.getUser(token);
        if (authError || !user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid token'
            }, {
                status: 401
            });
        }
        // Check if user is admin (only admins can create notifications directly)
        const { data: userData } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('users').select('role').eq('id', user.id).single();
        if (userData?.role !== 'admin') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Insufficient permissions'
            }, {
                status: 403
            });
        }
        const body = await request.json();
        const notification = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$notifications$2f$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NotificationService"].createNotification(body);
        if (notification) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                notification
            });
        } else {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Failed to create notification'
            }, {
                status: 500
            });
        }
    } catch (error) {
        console.error('Error creating notification:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__41f05b45._.js.map
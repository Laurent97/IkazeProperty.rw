import { supabase } from '@/lib/supabase';

export type NotificationType = 
  | 'payment_completed'
  | 'payment_failed'
  | 'promotion_activated'
  | 'promotion_expiring'
  | 'inquiry_received'
  | 'inquiry_approved'
  | 'listing_sold'
  | 'wallet_topup'
  | 'refund_processed';

export interface NotificationData {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  channels: ('email' | 'sms' | 'push' | 'in_app')[];
  priority: 'low' | 'medium' | 'high';
}

export class NotificationService {
  // Create notification record
  static async createNotification(data: NotificationData) {
    try {
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          user_id: data.user_id,
          type: data.type,
          title: data.title,
          message: data.message,
          data: data.data,
          channels: data.channels,
          priority: data.priority,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

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
  private static async processNotificationChannels(notification: any) {
    const { channels, user_id } = notification;

    // Get user preferences and contact info
    const { data: user } = await supabase
      .from('users')
      .select('email, phone, notification_preferences')
      .eq('id', user_id)
      .single();

    if (!user) return;

    const preferences = user.notification_preferences || {};

    for (const channel of channels) {
      try {
        switch (channel) {
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
    await supabase
      .from('notifications')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', notification.id);
  }

  // Send email notification
  private static async sendEmail(email: string, notification: any) {
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
  private static async sendSMS(phone: string, notification: any) {
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
  private static async sendPushNotification(userId: string, notification: any) {
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
  private static async markInAppNotificationRead(notificationId: string) {
    // In-app notifications are automatically available in the database
    // This method could be used to update read status when user views it
    return true;
  }

  // Generate email template
  private static generateEmailTemplate(notification: any): string {
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
  static async getUserNotifications(userId: string, limit = 20, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

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
  static async markAsRead(notificationId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', userId);

      return !error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  // Mark all notifications as read for user
  static async markAllAsRead(userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', userId)
        .is('read_at', null);

      return !error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  // Delete notification
  static async deleteNotification(notificationId: string, userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);

      return !error;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }
}

// Predefined notification templates
export const NotificationTemplates = {
  paymentCompleted: (amount: number, method: string) => ({
    title: 'Payment Completed',
    message: `Your payment of ${amount} RWF via ${method} has been completed successfully.`,
    channels: ['email', 'in_app'] as const,
    priority: 'high' as const
  }),

  paymentFailed: (amount: number, method: string, reason: string) => ({
    title: 'Payment Failed',
    message: `Your payment of ${amount} RWF via ${method} failed. Reason: ${reason}`,
    channels: ['email', 'in_app'] as const,
    priority: 'high' as const
  }),

  promotionActivated: (listingTitle: string, packageName: string) => ({
    title: 'Promotion Activated',
    message: `Your promotion "${packageName}" for listing "${listingTitle}" has been activated.`,
    channels: ['email', 'in_app'] as const,
    priority: 'medium' as const
  }),

  promotionExpiring: (listingTitle: string, daysLeft: number) => ({
    title: 'Promotion Expiring Soon',
    message: `Your promotion for listing "${listingTitle}" will expire in ${daysLeft} days.`,
    channels: ['email', 'in_app'] as const,
    priority: 'medium' as const
  }),

  inquiryReceived: (listingTitle: string, buyerName: string) => ({
    title: 'New Inquiry Received',
    message: `You have received a new inquiry for your listing "${listingTitle}" from ${buyerName}.`,
    channels: ['email', 'sms', 'in_app'] as const,
    priority: 'high' as const
  }),

  inquiryApproved: (listingTitle: string) => ({
    title: 'Inquiry Approved',
    message: `Your inquiry for "${listingTitle}" has been approved. You can now contact the seller.`,
    channels: ['email', 'in_app'] as const,
    priority: 'high' as const
  }),

  walletTopup: (amount: number, method: string) => ({
    title: 'Wallet Top-up Successful',
    message: `Your wallet has been credited with ${amount} RWF via ${method}.`,
    channels: ['email', 'in_app'] as const,
    priority: 'medium' as const
  }),

  refundProcessed: (amount: number, reason: string) => ({
    title: 'Refund Processed',
    message: `A refund of ${amount} RWF has been processed. Reason: ${reason}`,
    channels: ['email', 'in_app'] as const,
    priority: 'high' as const
  })
};

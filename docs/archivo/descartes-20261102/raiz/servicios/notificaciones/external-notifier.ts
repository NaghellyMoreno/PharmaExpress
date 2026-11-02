import { Injectable } from '@nestjs/common';

export interface ExternalNotifier {
  send(channel: Channel, message: string): Promise<{ success: boolean }>;
}

@Injectable()
export class NotificationServiceNotifier implements ExternalNotifier {
  async send(channel: Channel, message: string): Promise<{ success: boolean }> {
    // Mock implementation; in production integrate Twilio (SMS) and Resend (email)
    console.log(`[NOTIFICATION] Sending ${channel} message: ${message}`);
    return { success: true };
  }
}

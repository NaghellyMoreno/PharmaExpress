import { Injectable } from '@nestjs/common';
import { NotificationService } from '../../servicios/notificaciones/notificationService';

@Injectable()
export class NotificationTasks {
  constructor(private readonly notificationService: NotificationService) {}

  async handleReminder1h(payload: any) {
    await this.notificationService.sendNow(payload);
  }

  async handleReminderDayBefore(payload: any) {
    await this.notificationService.sendNow(payload);
  }
}

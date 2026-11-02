import { Module } from '@nestjs/common';
import { NotificationsController } from './controller';
import { NotificationService } from '../servicios/notificaciones/notificationService';
import { PgBossModule } from '../../comunes/pg-boss';
import { NotificationTasks } from '../../comunes/pg-boss/tasks-notifications';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationService, NotificationTasks],
  imports: [PgBossModule],
})
export class NotificationsModule {}

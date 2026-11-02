import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { NotificationService } from '../servicios/notificaciones/notificationService';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ScheduleReminderDto } from './dto/schedule-reminder.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async create(@Body() dto: CreateNotificationDto) {
    const { patientId, channel, kind, message, payload } = dto;
    const channelEnum = channel as any; // assuming enum mapping
    return this.notificationService.sendNow({
      patientId,
      channel: channelEnum,
      kind,
      message,
      payload,
    });
  }

  @Post('schedule')
  async schedule(@Body() dto: ScheduleReminderDto) {
    return this.notificationService.scheduleReminder(dto);
  }

  @Get()
  async findByPatient(@Param('patientId', ParseUUIDPipe) patientId: string) {
    return this.notificationService.findByPatient(patientId);
  }
}

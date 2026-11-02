import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from '../../../controller';
import { NotificationService } from '../servicios/notificaciones/notificationService';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ScheduleReminderDto } from './dto/schedule-reminder.dto';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let service: NotificationService;

  const mockService = {
    sendNow: jest.fn(),
    scheduleReminder: jest.fn(),
    findByPatient: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        { provide: NotificationService, useValue: mockService },
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
    service = module.get<NotificationService>(NotificationService);
  });

  it('should create notification', async () => {
    const dto: CreateNotificationDto = {
      patientId: '123',
      channel: 'SMS',
      kind: 'REMINDER_1H',
      message: 'test',
      payload: {},
    };

    mockService.sendNow.mockResolvedValue({
      id: 1,
      patientId: '123',
      channel: 'SMS',
      message: 'test',
      kind: 'REMINDER_1H',
      payload: {},
      status: 'SENT',
      createdAt: new Date(),
      sentAt: new Date(),
      attempts: 0,
      lastAttemptAt: null,
    });

    const result = await controller.create(dto);
    expect(result).toMatchObject({ id: 1 });
    expect(mockService.sendNow).toHaveBeenCalled();
  });

  it('should schedule reminder', async () => {
    const dto: ScheduleReminderDto = {
      patientId: '123',
      channel: 'SMS',
      kind: 'REMINDER_1H',
      scheduledAt: new Date(),
      message: 'test',
      payload: {},
    };

    mockService.scheduleReminder.mockResolvedValue({
      id: 2,
      name: 'REMINDER_1H',
      scheduledAt: new Date(),
      payload: {},
      status: 'PENDING',
      createdAt: new Date(),
    });

    const result = await controller.schedule(dto);
    expect(result).toMatchObject({ id: 2 });
    expect(mockService.scheduleReminder).toHaveBeenCalled();
  });

  it('should find notifications by patient', async () => {
    mockService.findByPatient.mockResolvedValue([
      {
        id: 1,
        patientId: '123',
        channel: 'SMS',
        message: 'test',
        kind: 'REMINDER_1H',
        payload: {},
        status: 'SENT',
        createdAt: new Date(),
        sentAt: new Date(),
        attempts: 0,
        lastAttemptAt: null,
      },
    ]);

    const result = await controller.findByPatient('123');
    expect(result).toHaveLength(1);
    expect(mockService.findByPatient).toHaveBeenCalledWith('123');
  });
});

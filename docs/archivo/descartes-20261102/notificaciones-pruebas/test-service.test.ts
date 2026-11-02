import { NotificationService } from '../../../services/notificaciones/notificationService';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { ExternalNotifier } from '../../../servicios/notificaciones/external-notifier';
import { Prisma } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('NotificationService', () => {
  let service: NotificationService;
  let prisma: PrismaService;
  let notifier: ExternalNotifier;

  beforeEach(() => {
    prisma = {} as any;
    notifier = { send: jest.fn() } as any;
    service = new NotificationService(prisma, notifier);
  });

  it('should send notification and update status', async () => {
    const createData = {
      patientId: '123',
      channel: 'SMS',
      message: 'test message',
      kind: 'REMINDER_1H',
      payload: {},
    };
    prisma.notification.create.mockResolvedValue({
      id: 1,
      patientId: '123',
      channel: 'SMS',
      message: 'test message',
      kind: 'REMINDER_1H',
      payload: {},
      status: 'PENDING',
      createdAt: new Date(),
      sentAt: null,
      attempts: 0,
      lastAttemptAt: null,
    } as any);

    const sendMock = { success: true };
    notifier.send.mockResolvedValue(sendMock);

    const result = await service.sendNow({
      patientId: '123',
      channel: 'SMS',
      kind: 'REMINDER_1H',
      message: 'test message',
      payload: {},
    });

    expect(result.status).toBe('SENT');
    expect(prisma.notification.create).toHaveBeenCalled();
    expect(notifier.send).toHaveBeenCalledWith('SMS', 'test message');
  });

  // additional tests...
});

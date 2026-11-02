import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { ExternalNotifier } from './external-notifier';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifier: ExternalNotifier,
  ) {}

  /**
   * Envía una notificación de forma inmediata.
   * Idempotente: si ya existe una notificación SENT con mismo patientId, kind y payload, la devuelve.
   */
  async sendNow(params: {
    patientId: string;
    channel: Channel;
    kind: Kind;
    message: string;
    payload?: Record<string, any>;
  }): Promise<Prisma.NotificationGetManyType> {
    const { patientId, channel, kind, message, payload } = params;

    const existing = await this.prisma.notification.findFirst({
      where: {
        patientId,
        kind,
        status: Prisma.NotificationStatus.SENT,
        payload: payload ? JSON.stringify(payload) : undefined,
      },
    });

    if (existing) {
      return existing;
    }

    const notification = await this.prisma.notification.create({
      data: {
        patientId,
        channel,
        message,
        kind,
        payload,
        status: Prisma.NotificationStatus.PENDING,
      },
    });

    const result = await this.notifier.send(channel, message);

    await this.prisma.notification.update({
      where: { id: notification.id },
      data: {
        status: result.success ? Prisma.NotificationStatus.SENT : Prisma.NotificationStatus.FAILED,
        attempts: result.success ? notification.attempts : notification.attempts + 1,
        lastAttemptAt: new Date(),
        sentAt: new Date(),
      },
    });

    return updated;
  }

  /**
   * Programa un recordatorio programado.
   */
  async scheduleReminder(params: {
    patientId: string;
    channel: Channel;
    kind: Kind;
    scheduledAt: Date;
    message: string;
    payload?: Record<string, any>;
  }): Promise<Prisma.TaskGetManyType> {
    const { patientId, channel, kind, scheduledAt, message, payload } = params;

    const task = await this.prisma.task.create({
      data: {
        name: kind,
        scheduledAt,
        payload: payload ?? {},
        status: Prisma.TaskStatus.PENDING,
      },
    });

    // pg‑boss will pick the task at the scheduled time.
    return task;
  }

  /**
   * Procesa una tarea programada (llamada por pg‑boss).
   */
  async processTask(task: Prisma.TaskGetManyType): Promise<void> {
    const { patientId, channel, kind, message, payload } = task;

    const result = await this.notifier.send(channel, message);

    await this.prisma.task.update({
      where: { id: task.id },
      data: {
        status: result.success ? Prisma.TaskStatus.COMPLETED : Prisma.TaskStatus.FAILED,
        executedAt: new Date(),
      },
    });

    await this.prisma.notification.create({
      data: {
        patientId,
        channel,
        message,
        kind,
        payload,
        status: result.success ? Prisma.NotificationStatus.SENT : Prisma.NotificationStatus.FAILED,
        attempts: result.success ? 0 : (await this.prisma.notification.count({
          where: { patientId, kind },
        })) + 1,
        createdAt: new Date(),
      },
    });
  }

  /**
   * Busca notificaciones de un paciente.
   */
  async findByPatient(patientId: string) {
    return this.prisma.notification.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

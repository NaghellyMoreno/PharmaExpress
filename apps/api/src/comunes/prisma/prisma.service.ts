/**
 * Cliente Prisma compartido (una conexión; cada módulo solo usa los modelos de su propio
 * esquema de Postgres — ARQ-005/COMP-004, propuesta-tecnologica.md §3). No contiene reglas
 * de negocio: lo inyectan los repositorios de cada módulo.
 */

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}

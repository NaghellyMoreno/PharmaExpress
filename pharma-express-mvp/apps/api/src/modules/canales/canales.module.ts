import { Module } from '@nestjs/common';
import { CanalesController } from './canales.controller';

@Module({ controllers: [CanalesController] })
export class CanalesModule {}

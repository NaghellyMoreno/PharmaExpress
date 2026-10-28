import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DispensacionController, DispensadorGuard } from './dispensacion.controller';
import { DispensacionService } from './dispensacion.service';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET ?? 'cambiar-en-produccion', signOptions: { expiresIn: '12h' } })],
  controllers: [DispensacionController],
  providers: [DispensacionService, DispensadorGuard],
})
export class DispensacionModule {}

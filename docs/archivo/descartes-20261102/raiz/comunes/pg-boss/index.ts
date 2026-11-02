import { Module } from '@nestjs/common';
import { PgBossModule } from 'nestjs-pg-boss';
import { NotificationTasks } from './tasks-notifications';

@Module({
  imports: [
    PgBossModule.forRoot({
      connectionString: process.env.DATABASE_URL,
    }),
  ],
  providers: [NotificationTasks],
})
export class PgBossModule {}

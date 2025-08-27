// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './shared/prisma/prisma.module';
import { ProducersModule } from './producers/producers.module';
import { AppController } from './app.controller';
import { AreasModule } from './areas/areas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ProducersModule,
    AreasModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
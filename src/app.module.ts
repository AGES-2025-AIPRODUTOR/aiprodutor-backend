// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './shared/prisma/prisma.module';
import { ProducersModule } from './producers/producers.module';
import { AppController } from './app.controller';
import { AreasModule } from './areas/areas.module';
import { IrrigationTypesModule } from './irrigation-types/irrigation-types.module';
import { SoilTypesModule } from './soil-types/soil-types.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ProducersModule,
    AreasModule,
    IrrigationTypesModule,
    SoilTypesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

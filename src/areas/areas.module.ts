import { Module } from '@nestjs/common';
import { AreasController } from './areas.controller';
import { AreasService } from './areas.service';
import { AreasRepository } from './areas.repository';
import { PrismaModule } from '../shared/prisma/prisma.module';

import { ProducersModule } from '../producers/producers.module';
import { SoilTypesModule } from '../soil-types/soil-types.module';
import { IrrigationTypesModule } from '../irrigation-types/irrigation-types.module';

@Module({
  imports: [
    PrismaModule,
    ProducersModule,
    SoilTypesModule,
    IrrigationTypesModule,
  ],
  controllers: [AreasController],
  providers: [AreasService, AreasRepository],
})
export class AreasModule {}
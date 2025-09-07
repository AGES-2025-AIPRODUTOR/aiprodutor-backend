import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { IrrigationTypesController } from './irrigation-types.controller';
import { IrrigationTypesService } from './irrigation-types.service';
import { IrrigationTypesRepository } from './irrigation-types.repository';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [IrrigationTypesController],
  providers: [IrrigationTypesService, IrrigationTypesRepository],
})
export class IrrigationTypesModule {}

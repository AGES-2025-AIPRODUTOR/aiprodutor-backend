import { Module, forwardRef } from '@nestjs/common';
import { IrrigationTypesController } from './irrigation-types.controller';
import { IrrigationTypesService } from './irrigation-types.service';
import { IrrigationTypesRepository } from './irrigation-types.repository';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { AreasModule } from '../areas/areas.module';

@Module({
  imports: [PrismaModule, forwardRef(() => AreasModule)],
  controllers: [IrrigationTypesController],
  providers: [IrrigationTypesService, IrrigationTypesRepository],
  exports: [IrrigationTypesService],
})
export class IrrigationTypesModule {}

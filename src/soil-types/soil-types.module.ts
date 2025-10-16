import { forwardRef, Module } from '@nestjs/common';
import { SoilTypesController } from './soil-types.controller';
import { SoilTypesService } from './soil-types.service';
import { SoilTypesRepository } from './soil-types.repository';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { AreasModule } from '../areas/areas.module';

@Module({
  imports: [PrismaModule, forwardRef(() => AreasModule)],
  controllers: [SoilTypesController],
  providers: [SoilTypesService, SoilTypesRepository],
  exports: [SoilTypesService],
})
export class SoilTypesModule {}

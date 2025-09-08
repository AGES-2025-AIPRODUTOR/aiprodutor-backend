import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { SoilTypesController } from './soil-types.controller';
import { SoilTypesService } from './soil-types.service';
import { SoilTypesRepository } from './soil-types.repository';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  controllers: [SoilTypesController],
  providers: [SoilTypesService, SoilTypesRepository],
})
export class SoilTypesModule {}

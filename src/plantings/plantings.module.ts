import { Module } from '@nestjs/common';
import { PlantingsController } from './plantings.controller';
import { PlantingsService } from './plantings.service';
import { PlantingsRepository } from './plantings.repository';
import { PrismaModule } from '../shared/prisma/prisma.module';

import { ProductsModule } from '../products/products.module';
import { VarietiesModule } from '../varieties/varieties.module';
import { AreasModule } from '../areas/areas.module';

@Module({
  imports: [
    PrismaModule,
    ProductsModule,
    VarietiesModule,
    AreasModule,
  ],
  controllers: [PlantingsController],
  providers: [PlantingsService, PlantingsRepository],
})
export class PlantingsModule {}
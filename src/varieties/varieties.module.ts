import { Module } from '@nestjs/common';
import { VarietiesController } from './varieties.controller';
import { VarietiesService } from './varieties.service';
import { VarietiesRepository } from './varieties.repository';
import { PrismaModule } from '../shared/prisma/prisma.module';

import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    PrismaModule,
    ProductsModule,
  ],
  controllers: [VarietiesController],
  providers: [VarietiesService, VarietiesRepository],
})
export class VarietiesModule {}
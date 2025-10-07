import { Module, forwardRef } from '@nestjs/common';
import { HarvestsService } from './harvests.service';
import { HarvestsController } from './harvests.controller';
import { HarvestsRepository } from './harvests.repository';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { AreasModule } from '../areas/areas.module';
import { ProducersModule } from '../producers/producers.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    PrismaModule,
    AreasModule,
    forwardRef(() => ProducersModule),
    ProductsModule,
  ],
  controllers: [HarvestsController],
  providers: [HarvestsService, HarvestsRepository],
  exports: [HarvestsService],
})
export class HarvestsModule {}
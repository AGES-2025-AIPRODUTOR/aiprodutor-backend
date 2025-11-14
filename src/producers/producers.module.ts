import { Module, forwardRef } from '@nestjs/common';
import { ProducersService } from './producers.service';
import { ProducersController } from './producers.controller';
import { ProducersRepository } from './producers.repository';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { PlantingsModule } from '../plantings/plantings.module';
import { HarvestsModule } from '../harvests/harvests.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => PlantingsModule),
    forwardRef(() => HarvestsModule),
  ],
  controllers: [ProducersController],
  providers: [ProducersService, ProducersRepository],
  exports: [ProducersService],
})
export class ProducersModule {}

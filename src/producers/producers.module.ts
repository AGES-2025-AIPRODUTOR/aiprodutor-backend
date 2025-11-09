import { Module, forwardRef } from '@nestjs/common';
import { ProducersService } from './producers.service';
import { ProducersController } from './producers.controller';
import { ProducersRepository } from './producers.repository';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { PlantingsModule } from '../plantings/plantings.module';
import { HarvestsModule } from '../harvests/harvests.module';
import { HarvestsRepository } from 'src/harvests/harvests.repository';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => PlantingsModule),
    forwardRef(() => HarvestsModule),
  ],
  controllers: [ProducersController],
  providers: [ProducersService, ProducersRepository, HarvestsRepository],
  exports: [ProducersService],
})
export class ProducersModule {}

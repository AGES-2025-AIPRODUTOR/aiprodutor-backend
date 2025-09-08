import { Module } from '@nestjs/common';
import { ProducersService } from './producers.service';
import { ProducersController } from './producers.controller';
import { ProducersRepository } from './producers.repository';
import { PrismaModule } from '../shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProducersController],
  providers: [ProducersService, ProducersRepository],
  exports: [ProducersService],
})
export class ProducersModule {}
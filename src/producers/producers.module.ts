import { Module } from '@nestjs/common';
import { ProducersService } from './producers.service';
import { ProducersController } from './producers.controller';
import { ProducersRepository } from './producers.repository';

@Module({
  controllers: [ProducersController],
  providers: [ProducersService, ProducersRepository],
})
export class ProducersModule {}

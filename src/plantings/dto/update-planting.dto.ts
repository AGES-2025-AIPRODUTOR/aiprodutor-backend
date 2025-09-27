import { PartialType } from '@nestjs/swagger';
import { PlantingRequestDto } from './planting-request.dto';


export class UpdatePlantingDto extends PartialType(PlantingRequestDto) {}
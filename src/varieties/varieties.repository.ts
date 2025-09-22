import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { VarietyRequestDto } from './dto/variety-request.dto';

@Injectable()
export class VarietiesRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(varietyRequestDto: VarietyRequestDto) {
        return this.prisma.variety.create({
            data: varietyRequestDto,
        });
    }

    async findAll() {
        return this.prisma.variety.findMany();
    }

    async findById(id: number) {
        return this.prisma.variety.findUnique({
            where: { id },
        });
    }

    async findByProductId(productId: number) {
        return this.prisma.variety.findMany({
            where: { productId },
        });
    }

    async update(id: number, varietyRequestDto: Partial<VarietyRequestDto>) {
        return this.prisma.variety.update({
            where: { id },
            data: varietyRequestDto,
        });
    }

    async remove(id: number) {
        return this.prisma.variety.delete({
            where: { id },
        });
    }
}

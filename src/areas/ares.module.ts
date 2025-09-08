import { Module } from "@nestjs/common";
import { AreasController } from "./areas.controller";
import { AreasService } from "./areas.service";
import { AreasRepository } from "./areas.repository";
import { PrismaService } from "../prisma/schema.prisma"; // ajuste o path

@Module({
  controllers: [AreasController],
  providers: [AreasService, AreasRepository, PrismaService],
})
export class AreasModule {}

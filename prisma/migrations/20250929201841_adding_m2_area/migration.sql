/*
  Warnings:

  - You are about to alter the column `areaM2` on the `areas` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "public"."areas" ALTER COLUMN "areaM2" SET DATA TYPE DECIMAL(65,30);

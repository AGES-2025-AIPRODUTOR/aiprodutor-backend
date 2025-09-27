/*
  Warnings:

  - You are about to drop the column `producerId` on the `harvests` table. All the data in the column will be lost.
  - You are about to drop the column `harvestDate` on the `plantings` table. All the data in the column will be lost.
  - You are about to drop the column `harvestForecast` on the `plantings` table. All the data in the column will be lost.
  - You are about to drop the column `harvestId` on the `plantings` table. All the data in the column will be lost.
  - You are about to alter the column `quantityPlanted` on the `plantings` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `quantityHarvested` on the `plantings` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - Added the required column `plantingId` to the `harvests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color` to the `plantings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `plantings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."harvests" DROP CONSTRAINT "harvests_producerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."plantings" DROP CONSTRAINT "plantings_harvestId_fkey";

-- AlterTable
ALTER TABLE "public"."harvests" DROP COLUMN "producerId",
ADD COLUMN     "plantingId" INTEGER NOT NULL,
ALTER COLUMN "endDate" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "cycle" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."plantings" DROP COLUMN "harvestDate",
DROP COLUMN "harvestForecast",
DROP COLUMN "harvestId",
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "expectedHarvestDate" TIMESTAMP(3),
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "plantingEndDate" TIMESTAMP(3),
ALTER COLUMN "quantityPlanted" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "quantityHarvested" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."producers" ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."products" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."varieties" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "public"."harvests" ADD CONSTRAINT "harvests_plantingId_fkey" FOREIGN KEY ("plantingId") REFERENCES "public"."plantings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

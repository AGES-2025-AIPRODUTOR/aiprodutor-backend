/*
  Warnings:

  - You are about to drop the column `plantingId` on the `harvests` table. All the data in the column will be lost.
  - Added the required column `harvestId` to the `plantings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."harvests" DROP CONSTRAINT "harvests_plantingId_fkey";

-- AlterTable
ALTER TABLE "public"."harvests" DROP COLUMN "plantingId";

-- AlterTable
ALTER TABLE "public"."plantings" ADD COLUMN     "harvestId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."plantings" ADD CONSTRAINT "plantings_harvestId_fkey" FOREIGN KEY ("harvestId") REFERENCES "public"."harvests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

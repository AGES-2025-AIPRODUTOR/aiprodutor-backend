/*
  Warnings:

  - You are about to drop the column `ativo` on the `areas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."areas" DROP COLUMN "ativo",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

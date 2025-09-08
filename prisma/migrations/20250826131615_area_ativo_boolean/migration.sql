/*
  Warnings:

  - You are about to drop the column `status` on the `areas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."areas" DROP COLUMN "status",
ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

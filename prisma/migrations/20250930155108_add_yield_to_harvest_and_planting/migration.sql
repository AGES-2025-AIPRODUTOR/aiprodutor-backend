-- AlterTable
ALTER TABLE "public"."harvests" ADD COLUMN     "expected_yield" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."plantings" ADD COLUMN     "expected_yield" DOUBLE PRECISION;

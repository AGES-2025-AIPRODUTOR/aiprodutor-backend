-- Adiciona a extensão PostGIS se ela não existir
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;

CREATE TYPE "public"."HarvestStatus" AS ENUM ('in_progress', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "public"."producers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "producers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."areas" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "polygon" geometry NOT NULL,
    "areaM2" DECIMAL(65,30) NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "producerId" INTEGER NOT NULL,
    "soilTypeId" INTEGER NOT NULL,
    "irrigationTypeId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."harvests" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    -- CORREÇÃO: A coluna 'status' agora usa o novo tipo Enum e tem um valor padrão.
    "status" "public"."HarvestStatus" DEFAULT 'in_progress',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "producerId" INTEGER NOT NULL,
    "expected_yield" DOUBLE PRECISION,

    CONSTRAINT "harvests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."plantings" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "plantingDate" TIMESTAMP(3) NOT NULL,
    "plantingEndDate" TIMESTAMP(3),
    "expectedHarvestDate" TIMESTAMP(3),
    "quantityPlanted" DOUBLE PRECISION NOT NULL,
    "quantityHarvested" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "harvestId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "expected_yield" DOUBLE PRECISION,

    CONSTRAINT "plantings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."soil_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "soil_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."irrigation_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "irrigation_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "producerId" INTEGER,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_AreaToPlanting" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AreaToPlanting_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "producers_document_key" ON "public"."producers"("document");

-- CreateIndex
CREATE UNIQUE INDEX "producers_email_key" ON "public"."producers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "harvests_name_key" ON "public"."harvests"("name");

-- CreateIndex
CREATE UNIQUE INDEX "soil_types_name_key" ON "public"."soil_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "irrigation_types_name_key" ON "public"."irrigation_types"("name");

-- CreateIndex
CREATE INDEX "_AreaToPlanting_B_index" ON "public"."_AreaToPlanting"("B");

-- AddForeignKey
ALTER TABLE "public"."areas" ADD CONSTRAINT "areas_irrigationTypeId_fkey" FOREIGN KEY ("irrigationTypeId") REFERENCES "public"."irrigation_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."areas" ADD CONSTRAINT "areas_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "public"."producers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."areas" ADD CONSTRAINT "areas_soilTypeId_fkey" FOREIGN KEY ("soilTypeId") REFERENCES "public"."soil_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."harvests" ADD CONSTRAINT "harvests_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "public"."producers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plantings" ADD CONSTRAINT "plantings_harvestId_fkey" FOREIGN KEY ("harvestId") REFERENCES "public"."harvests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plantings" ADD CONSTRAINT "plantings_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "public"."producers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AreaToPlanting" ADD CONSTRAINT "_AreaToPlanting_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."areas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AreaToPlanting" ADD CONSTRAINT "_AreaToPlanting_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."plantings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- Adiciona a extensão PostGIS se ela ainda não existir
CREATE EXTENSION IF NOT EXISTS postgis;

-- CreateTable
CREATE TABLE "public"."producers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "producerId" INTEGER NOT NULL,
    "soilTypeId" INTEGER NOT NULL,
    "irrigationTypeId" INTEGER NOT NULL,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."harvests" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "cycle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "producerId" INTEGER NOT NULL,

    CONSTRAINT "harvests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."plantings" (
    "id" SERIAL NOT NULL,
    "plantingDate" TIMESTAMP(3) NOT NULL,
    "harvestForecast" TIMESTAMP(3) NOT NULL,
    "harvestDate" TIMESTAMP(3),
    "quantityPlanted" DECIMAL(65,30) NOT NULL,
    "quantityHarvested" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "areaId" INTEGER NOT NULL,
    "harvestId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "varietyId" INTEGER NOT NULL,

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

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."varieties" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "varieties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "producers_document_key" ON "public"."producers"("document");

-- CreateIndex
CREATE UNIQUE INDEX "producers_email_key" ON "public"."producers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "soil_types_name_key" ON "public"."soil_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "irrigation_types_name_key" ON "public"."irrigation_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "public"."products"("name");

-- AddForeignKey
ALTER TABLE "public"."areas" ADD CONSTRAINT "areas_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "public"."producers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."areas" ADD CONSTRAINT "areas_soilTypeId_fkey" FOREIGN KEY ("soilTypeId") REFERENCES "public"."soil_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."areas" ADD CONSTRAINT "areas_irrigationTypeId_fkey" FOREIGN KEY ("irrigationTypeId") REFERENCES "public"."irrigation_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."harvests" ADD CONSTRAINT "harvests_producerId_fkey" FOREIGN KEY ("producerId") REFERENCES "public"."producers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plantings" ADD CONSTRAINT "plantings_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "public"."areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plantings" ADD CONSTRAINT "plantings_harvestId_fkey" FOREIGN KEY ("harvestId") REFERENCES "public"."harvests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plantings" ADD CONSTRAINT "plantings_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."plantings" ADD CONSTRAINT "plantings_varietyId_fkey" FOREIGN KEY ("varietyId") REFERENCES "public"."varieties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."varieties" ADD CONSTRAINT "varieties_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
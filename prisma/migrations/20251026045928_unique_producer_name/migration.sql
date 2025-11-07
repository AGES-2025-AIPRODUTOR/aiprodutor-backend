/*
  Warnings:

  - A unique constraint covering the columns `[producerId,name]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "products_producerId_name_key" ON "public"."products"("producerId", "name");

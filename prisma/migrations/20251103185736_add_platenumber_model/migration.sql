/*
  Warnings:

  - You are about to drop the column `plateNumber` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the column `plateNumber` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "plateNumber",
ADD COLUMN     "plateNumberId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "plateNumber";

-- CreateTable
CREATE TABLE "PlateNumber" (
    "id" SERIAL NOT NULL,
    "plate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlateNumber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlateNumber_plate_key" ON "PlateNumber"("plate");

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_plateNumberId_fkey" FOREIGN KEY ("plateNumberId") REFERENCES "PlateNumber"("id") ON DELETE SET NULL ON UPDATE CASCADE;

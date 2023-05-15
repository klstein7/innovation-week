/*
  Warnings:

  - Added the required column `addressId` to the `BusinessPartner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BusinessPartner" ADD COLUMN     "addressId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "postal" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BusinessPartner" ADD CONSTRAINT "BusinessPartner_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

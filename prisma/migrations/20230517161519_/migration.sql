/*
  Warnings:

  - You are about to drop the column `businessPartnerId` on the `Application` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[outletBusinessPartnerId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `outletBusinessPartnerId` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BusinessPartnerType" AS ENUM ('ALLIANCE_PARTNER', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "PartyType" AS ENUM ('BORROWER', 'GUARANTOR');

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_businessPartnerId_fkey";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "businessPartnerId",
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "outletBusinessPartnerId" TEXT NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "BusinessPartner" ADD COLUMN     "type" "BusinessPartnerType" NOT NULL DEFAULT 'CUSTOMER';

-- CreateTable
CREATE TABLE "Party" (
    "id" TEXT NOT NULL,
    "type" "PartyType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "businessPartnerId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "Party_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "businessPartnerId" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Party_businessPartnerId_key" ON "Party"("businessPartnerId");

-- CreateIndex
CREATE UNIQUE INDEX "Party_applicationId_key" ON "Party"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_username_key" ON "Account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Account_businessPartnerId_key" ON "Account"("businessPartnerId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_outletBusinessPartnerId_key" ON "Application"("outletBusinessPartnerId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_outletBusinessPartnerId_fkey" FOREIGN KEY ("outletBusinessPartnerId") REFERENCES "BusinessPartner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_businessPartnerId_fkey" FOREIGN KEY ("businessPartnerId") REFERENCES "BusinessPartner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_businessPartnerId_fkey" FOREIGN KEY ("businessPartnerId") REFERENCES "BusinessPartner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

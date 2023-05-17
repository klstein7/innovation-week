/*
  Warnings:

  - You are about to drop the column `outletBusinessPartnerId` on the `Application` table. All the data in the column will be lost.
  - Added the required column `outletId` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_outletBusinessPartnerId_fkey";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "outletBusinessPartnerId",
ADD COLUMN     "outletId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_outletId_fkey" FOREIGN KEY ("outletId") REFERENCES "BusinessPartner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
